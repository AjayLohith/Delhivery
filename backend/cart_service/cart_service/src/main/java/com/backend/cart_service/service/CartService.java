package com.backend.cart_service.service;

import com.backend.cart_service.execption.CheckoutException;
import com.backend.cart_service.kafka.OrderEventProducer;
import com.backend.cart_service.model.CartItem;
import com.backend.cart_service.model.CheckoutRequest;
import com.backend.cart_service.model.OrderEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class CartService {
    private final RedisTemplate<String,Object>redisTemplate;
    private final OrderEventProducer orderEventProducer;
    private final ObjectMapper objectMapper;
    private final ProductClient productClient;

    private String cartKey(String userId){
        return "cart:"+userId;
    }

    public CartItem addToCart(String userId, CartItem cartItem) {
        cartItem.setTotalPrice(Math.round(cartItem.getPrice() * cartItem.getQuantity()*100.0)/100.0);
        redisTemplate.opsForHash().put(cartKey(userId),String.valueOf(cartItem.getProductId()),cartItem);
        log.info("Added Product {} to cart for user {}",cartItem.getProductId(),userId);
        return cartItem;
    }

    public List<CartItem> getCart(String userId) {
        Map<Object,Object>entries=redisTemplate.opsForHash().entries(cartKey(userId));
        List<CartItem>items=new ArrayList<>();
        for (Object val:entries.values()){
            CartItem item=objectMapper.convertValue(val,CartItem.class);
            items.add(item);
        }
        return items;
    }

    public void removeFromCart(String userId, Long productId) {
        redisTemplate.opsForHash().delete(cartKey(userId),String.valueOf(productId));
        log.info("Removed product {} from cart of user{}",productId,userId);
    }

    public void clearCart(String userId) {
        redisTemplate.delete(cartKey(userId));
        log.info("Cleared cart of user{}",userId);
    }


    public String checkOut(String userId, CheckoutRequest req) {

        List<CartItem>items=getCart(userId);
        if(items.isEmpty()){
            return "Cart is empty nothing to checkout";
        }

        String email=req.getEmail();
        String paymentMethod= req.getPaymentMethod();
        String coupounCode=req.getCouponCode();

        if(email==null || email.isBlank()){
            throw new CheckoutException("Email is required");
        }
        if(!"COD".equalsIgnoreCase(paymentMethod) && !"ONLINE".equalsIgnoreCase(paymentMethod)){
            throw new CheckoutException("Payment should be COD or Online");
        }

        //Reduce stock
        for (CartItem item:items){
            try {
                Boolean success = productClient.decrementStock(
                        item.getProductId(),
                        item.getQuantity()
                );
                if (Boolean.FALSE.equals(success)) {
                    throw new RuntimeException("Out of stock: " + item.getProductName());
                }
            }
            catch (Exception e){
                log.error("Stock check failed for product {}", item.getProductId(), e);

                throw new CheckoutException(
                        "Product Service Error: " + e.getMessage()
                );
            }
        }

        double subTotal =items.stream()
                .mapToDouble(CartItem::getTotalPrice)
                .sum();
        subTotal =Math.round(subTotal *100.0)/100.0;

        double discount=0;
        if("WELCOME10".equalsIgnoreCase(coupounCode)){
            discount= subTotal *0.10;
        }

        double codFee=0;
        if("COD".equalsIgnoreCase(paymentMethod)){
            codFee=49;
        }

        double finalTotal=subTotal-discount+codFee;
        finalTotal=Math.round(finalTotal*100.0)/100.0;

        LocalDate estimatedDelivery =LocalDate.now().plusDays(5);

        String paymentStatus="COD".equalsIgnoreCase(paymentMethod)?"PENDING":"PAID";

        String orderId=
                "ORD-"+ UUID.randomUUID()
                        .toString()
                        .substring(0,8)
                        .toUpperCase();

        OrderEvent event= OrderEvent.builder()
                .orderId(orderId)
                .userId(userId)
                .userEmail(email)
                .items(items)
                .subtotal(subTotal)
                .discountAmount(discount)
                .codFee(codFee)
                .totalAmount(finalTotal)
                .paymentMethod(paymentMethod)
                .couponCode(coupounCode)
                .estimatedDelivery(estimatedDelivery)
                .status("PLACED")
                .build();

        orderEventProducer.sendOrderEvent(event);
        clearCart(userId);

        log.info("Checkout done OrderId:{},UserId:{},PaymentMethod:{}",
                orderId,
                userId,
                paymentMethod);

        return String.format(
                """
                Order Placed Successfully!
                
                Order ID: %s
                Payment Method: %s
                Payment Status: %s
                Estimated Delivery: %s
                Total Amount: Rs. %.2f
                """,
                orderId,
                paymentMethod,
                paymentStatus,
                estimatedDelivery,
                finalTotal
        );
    }
}
