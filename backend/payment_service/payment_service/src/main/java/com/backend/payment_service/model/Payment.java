package com.backend.payment_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String orderId;       // matches OrderEvent.orderId from Kafka

    @Column(nullable = false)
    private String userId;

    private String userEmail;

    @Column(nullable = false)
    private Double amount;

    private String razorpayOrderId;   // returned by Razorpay API

    private String razorpayPaymentId; // returned after frontend completes payment

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    private String failureReason;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum PaymentStatus {
        PENDING,    // Razorpay order created, waiting for user to pay
        SUCCESS,    // Payment verified via /verify endpoint
        FAILED      // Payment failed or expired
    }
}

