package com.backend.payment_service.controller;

import com.backend.payment_service.model.OrderTracking;
import com.backend.payment_service.model.Payment;
import com.backend.payment_service.repository.PaymentRepository;
import com.backend.payment_service.service.PaymentService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payment")
@Slf4j
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/verify")
    public ResponseEntity<Payment>verifyPayment(@RequestParam String razorpayOrderId,
                                         @RequestParam String razorpayPaymentId){
        return ResponseEntity.ok(paymentService.verifyUpiPayment(razorpayOrderId,razorpayPaymentId));
    }

    @PostMapping("/fail")
    public ResponseEntity<Payment> fail(@RequestParam String razorpayOrderId,
                                        @RequestParam String reason) {
        return ResponseEntity.ok(paymentService.markFailed(razorpayOrderId, reason));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Payment>>getPaymentByUser(@PathVariable String userId){
        return ResponseEntity.ok(paymentService.getPaymentByUser(userId));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Payment>getPaymentByOrderId(@PathVariable String orderId){
        return ResponseEntity.ok(paymentService.getPaymentByOrderId(orderId));
    }

    @PatchMapping("/order/cancel-order/{orderId}")
    public ResponseEntity<Payment>cancelOrderById(@PathVariable String orderId){
        return ResponseEntity.ok(paymentService.cancelOrderById(orderId));
    }

    @GetMapping("/track/{orderId}")
    public ResponseEntity<List<OrderTracking>> track(@PathVariable String orderId) {
        return ResponseEntity.ok(paymentService.getTracking(orderId));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String,String>>health(){
        return ResponseEntity.ok(Map.of("status","Payment Service is running"));
    }
}
