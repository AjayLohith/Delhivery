package com.backend.payment_service.kafka;

import com.backend.payment_service.model.Payment;
import com.backend.payment_service.service.PaymentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentEventConsumer {
    private final PaymentService paymentService;
    private final ObjectMapper objectMapper;

    // Listens to the SAME topic as email-service, but different group-id=payment-group
    // Kafka delivers the same message independently to each consumer group.
    // This consumer auto-initiates a Razorpay payment on every order.
    @KafkaListener(topics = "order-placed-topic", groupId = "payment-group")
    public void handleOrderPlaced(String message) {
        try {
            log.info("PaymentConsumer received message: {}", message);

            // Deserialize the JSON string sent by cart-service OrderEventProducer
            Map<?, ?> event = objectMapper.readValue(message, Map.class);

            String orderId   = (String) event.get("orderId");
            String userId    = (String) event.get("userId");
            String userEmail = (String) event.get("userEmail");
            Double amount    = ((Number) event.get("totalAmount")).doubleValue();

            log.info("Processing payment for orderId: {}, user: {}, amount: {}", orderId, userId, amount);

            Payment payment = paymentService.initiatePayment(orderId, userId, userEmail, amount);
            log.info("Payment record created with status: {} | RazorpayOrderId: {}",
                    payment.getStatus(), payment.getRazorpayOrderId());

        } catch (Exception e) {
            log.error("Failed to process order event in PaymentConsumer: {}", e.getMessage(), e);
        }
    }
}
