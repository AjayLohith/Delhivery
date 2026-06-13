package com.backend.cart_service.service;

import com.backend.cart_service.execption.CheckoutException;
import com.backend.cart_service.kafka.OrderEventProducer;
import com.backend.cart_service.model.CartItem;
import com.backend.cart_service.model.OrderEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.ws.rs.Path;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.common.protocol.types.Field;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

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


    public String checkOut(String userId, String email) {
        List<CartItem>items=getCart(userId);
        if(items.isEmpty()){
            return "Cart is empty nothing to checkout";
        }

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
                throw new CheckoutException(
                        item.getProductName()+" is out of stock"
                );
            }
        }


        double total=items.stream()
                .mapToDouble(CartItem::getTotalPrice)
                .sum();
        total=Math.round(total*100.0)/100.0;
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
                .totalAmount(total)
                .status("PLACED")
                .build();

        orderEventProducer.sendOrderEvent(event);
        clearCart(userId);

        log.info("Checkout done OrderId:{},UserId:{}",orderId,userId);
        return "Order Placed! OrderId: "+orderId+"|Total:Rs. "+total;
    }
}
