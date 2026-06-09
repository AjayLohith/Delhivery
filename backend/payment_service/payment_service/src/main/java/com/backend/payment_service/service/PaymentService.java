package com.backend.payment_service.service;

import com.backend.payment_service.model.Payment;
import com.backend.payment_service.repository.PaymentRepository;
import com.thoughtworks.xstream.annotations.XStreamImplicit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {
    private final PaymentRepository paymentRepo;

    @Value("${RAZORPAY_KEY_ID}")
    private String razorpayKeyId;

    @Value("${RAZORPAY_SECRET_KEY}")
    private String razorpaySecretKey;

    public Payment verifyPayment(String razorpayOrderId,
                                 String razorpayPaymentId) {

    }

    public List<Payment> getPaymentByUser(String userId) {
    }

    public Payment getPaymentByOrderId(String orderId) {
    }

    public Payment initiatePayment(String orderId, String userId, String userEmail, Double amount) {
    }
}
