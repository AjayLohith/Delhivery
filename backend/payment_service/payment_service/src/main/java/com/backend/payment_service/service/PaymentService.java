package com.backend.payment_service.service;

import com.backend.payment_service.model.Payment;
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

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {
    private final PaymentRepository paymentRepo;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpaySecretKey;

    @PostConstruct
    public void test() {
        System.out.println("KEY = " + razorpayKeyId);
        System.out.println("SECRET = " + razorpaySecretKey);
    }

    @Transactional
    public Payment initiatePayment(String orderId, String userId, String userEmail, Double amount){
        try{
            RazorpayClient client=new RazorpayClient(razorpayKeyId,razorpaySecretKey);
            JSONObject options=new JSONObject();
            options.put("amount",(int)(amount*100));
            options.put("currency","INR");
            options.put("receipt",orderId);
            options.put("notes",new JSONObject().put("userId",userId));

            Order razorpayOrder =client.orders.create(options);
            String razorpayOrderId=razorpayOrder.get("id");

            Payment payment=Payment.builder()
                    .orderId(orderId)
                    .userId(userId)
                    .userEmail(userEmail)
                    .amount(amount)
                    .razorpayOrderId(razorpayOrderId)
                    .status(Payment.PaymentStatus.PENDING)
                    .build();

            Payment saved=paymentRepo.save(payment);
            log.info("Payment initiated. OrderId: {}, RazorpayOrderId: {}", orderId, razorpayOrderId);
            return saved;

        } catch (RazorpayException e) {
            log.error("Razorpay order creation failed for orderId: {}", orderId, e);
            Payment failed=Payment.builder()
                    .orderId(orderId)
                    .userId(userId)
                    .userEmail(userEmail)
                    .amount(amount)
                    .status(Payment.PaymentStatus.FAILED)
                    .failureReason(e.getMessage())
                    .build();
            return paymentRepo.save(failed);
        }
    }

    @Transactional
    public Payment verifyPayment(String razorpayOrderId,
                                 String razorpayPaymentId) {
        Payment payment=paymentRepo.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(()->new RuntimeException("Payment not found for razorpayOrderId: "+razorpayPaymentId));

        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setStatus(Payment.PaymentStatus.SUCCESS);
        payment.setUpdatedAt(LocalDateTime.now());
        Payment saved =paymentRepo.save(payment);
        log.info("Payment verified. RazorpayPaymentId: {}",razorpayPaymentId);
        return saved;
    }

    public List<Payment> getPaymentByUser(String userId) {
        return paymentRepo.findByUserId(userId);
    }

    public Payment getPaymentByOrderId(String orderId) {
        return paymentRepo.findByOrderId(orderId)
                .orElseThrow(()->new RuntimeException("Payment not found for orderId: "+orderId));
    }


//    public Payment paymentByCOD() {
//
//    }
}
