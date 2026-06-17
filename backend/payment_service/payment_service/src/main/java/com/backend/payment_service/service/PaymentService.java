package com.backend.payment_service.service;

import com.backend.payment_service.model.OrderTracking;
import com.backend.payment_service.model.Payment;
import com.backend.payment_service.repository.OrderTrackingRepository;
import com.backend.payment_service.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {
    private final PaymentRepository paymentRepo;
    private final OrderTrackingRepository trackingRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpaySecretKey;

    @Transactional
    public Payment processPayment(Map<?,?>event){
        String orderId= (String) event.get("orderId");
        String userId= (String) event.get("userId");
        String userEmail     = (String) event.get("userEmail");
        String paymentMethod = (String) event.get("paymentMethod");

        Payment.PaymentMethod method =
                "COD".equalsIgnoreCase(paymentMethod)
                        ? Payment.PaymentMethod.COD
                        : Payment.PaymentMethod.UPI_RAZORPAY;

        String couponCode    = (String) event.get("couponCode");

        Object deliveryObj = event.get("estimatedDelivery");
        LocalDate estimatedDelivery=null;
        if(deliveryObj!=null){
            estimatedDelivery=LocalDate.parse(deliveryObj.toString());
        }

        double subtotal      = event.get("subtotal") == null
                ? 0.0
                : ((Number) event.get("subtotal")).doubleValue();

        double discount =
                event.get("discountAmount") == null
                        ? 0.0
                        : ((Number) event.get("discountAmount")).doubleValue();

        double codFee =
                event.get("codFee") == null
                        ? 0.0
                        : ((Number) event.get("codFee")).doubleValue();

        double total = event.get("totalAmount") == null
                ? 0.0
                : ((Number) event.get("totalAmount")).doubleValue();

        String productNames = "";
        Object itemsObj = event.get("items");
        if (itemsObj instanceof List) {
            List<?> itemsList = (List<?>) itemsObj;
            StringBuilder sb = new StringBuilder();
            for (Object item : itemsList) {
                if (item instanceof Map) {
                    Map<?, ?> itemMap = (Map<?, ?>) item;
                    String name = (String) itemMap.get("productName");
                    if (name != null) {
                        sb.append(name).append(", ");
                    }
                }
            }
            if (sb.length() > 0) {
                sb.setLength(sb.length() - 2);
            }
            productNames = sb.toString();
        }

        Payment payment = Payment.builder()
                .orderId(orderId).userId(userId).userEmail(userEmail)
                .subtotal(subtotal).discountAmount(discount).codFee(codFee)
                .totalAmount(total).couponCode(couponCode)
                .productNames(productNames)
                .estimatedDelivery(estimatedDelivery)
                .paymentMethod(method)
                .build();

        if (method== Payment.PaymentMethod.COD) {
            payment.setStatus(Payment.PaymentStatus.COD_PENDING);
            paymentRepo.save(payment);
            addTracking(orderId, "ORDER PLACED", "COD order confirmed. Pay Rs." + total + " on delivery.");
            log.info("COD order saved: {}", orderId);

        } else { // UPI_RAZORPAY
            try {
                RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpaySecretKey);
                JSONObject options = new JSONObject();
                options.put("amount", (int)(total * 100));
                options.put("currency", "INR");
                options.put("receipt", orderId);
                Order razorpayOrder = client.orders.create(options);
                payment.setRazorpayOrderId(razorpayOrder.get("id"));
                payment.setStatus(Payment.PaymentStatus.PENDING);
                paymentRepo.save(payment);
                addTracking(orderId, "ORDER PLACED", "Awaiting UPI payment. Razorpay order: " + razorpayOrder.get("id"));
                log.info("Razorpay order created for {}: {}", orderId, (String) razorpayOrder.get("id"));
            } catch (RazorpayException e) {
                payment.setStatus(Payment.PaymentStatus.FAILED);
                payment.setFailureReason(e.getMessage());
                paymentRepo.save(payment);
                addTracking(orderId, "PAYMENT FAILED", "Razorpay error: " + e.getMessage());
                log.error("Razorpay failed for {}: {}", orderId, e.getMessage());
            }
        }
        return payment;
    }

    @Transactional
    public Payment verifyUpiPayment(String razorpayOrderId, String razorpayPaymentId) {
        Payment p = paymentRepo.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new RuntimeException("Payment not found: " + razorpayOrderId));
        p.setRazorpayPaymentId(razorpayPaymentId);
        p.setStatus(Payment.PaymentStatus.SUCCESS);
        p.setUpdatedAt(LocalDateTime.now());
        paymentRepo.save(p);
        addTracking(p.getOrderId(), "PAYMENT CONFIRMED", "UPI payment received. Payment ID: " + razorpayPaymentId);
        addTracking(p.getOrderId(), "PROCESSING", "Order is being prepared for dispatch.");
        log.info("UPI payment verified: {}", razorpayPaymentId);
        return p;
    }

//    @Transactional
//    public Payment verifyPayment(String razorpayOrderId,
//                                 String razorpayPaymentId) {
//        Payment payment = paymentRepo.findByRazorpayOrderId(razorpayOrderId)
//                .orElseThrow(() -> new RuntimeException("Payment not found for razorpayOrderId: " + razorpayPaymentId));
//
//        payment.setRazorpayPaymentId(razorpayPaymentId);
//        payment.setStatus(Payment.PaymentStatus.SUCCESS);
//        payment.setUpdatedAt(LocalDateTime.now());
//        Payment saved = paymentRepo.save(payment);
//        log.info("Payment verified. RazorpayPaymentId: {}", razorpayPaymentId);
//        return saved;
//    }

    public List<Payment> getPaymentByUser(String userId) {
        return paymentRepo.findByUserId(userId);
    }

    public Payment getPaymentByOrderId(String orderId) {
        return paymentRepo.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found for orderId: " + orderId));
    }

    public List<OrderTracking> getTracking(String orderId) {
        return trackingRepository.findByOrderIdOrderByTimestampAsc(orderId);
    }

    private void addTracking(String orderId, String status, String description) {
        trackingRepository.save(OrderTracking.builder()
                .orderId(orderId).status(status).description(description).build());
    }

    @Transactional
    public Payment markFailed(String razorpayOrderId, String reason) {
        Payment p = paymentRepo.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new RuntimeException("Payment not found: " + razorpayOrderId));
        p.setStatus(Payment.PaymentStatus.FAILED);
        p.setFailureReason(reason);
        p.setUpdatedAt(LocalDateTime.now());
        paymentRepo.save(p);
        addTracking(p.getOrderId(), "PAYMENT FAILED", reason);
        return p;
    }
}
