package com.backend.payment_service.controller;

import com.backend.payment_service.model.Payment;
import com.backend.payment_service.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payment")
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/verify")
    public ResponseEntity<Payment>verifyPayment(@RequestParam String razorpayOrderId,
                                         @RequestParam String razorpayPaymentId){
        return ResponseEntity.ok(paymentService.verifyPayment(razorpayOrderId,razorpayPaymentId));
    }

//    public ResponseEntity<Payment>cashOnDelivery(){
//        return ResponseEntity.ok(paymentService.paymentByCOD());
//    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Payment>>getPaymentByUser(@PathVariable String userId){
        return ResponseEntity.ok(paymentService.getPaymentByUser(userId));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Payment>getPaymentByOrderId(@PathVariable String orderId){
        return ResponseEntity.ok(paymentService.getPaymentByOrderId(orderId));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String,String>>health(){
        return ResponseEntity.ok(Map.of("status","Payment Service is running"));
    }
}
