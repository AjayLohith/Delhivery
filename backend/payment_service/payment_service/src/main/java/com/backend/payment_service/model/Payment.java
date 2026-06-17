package com.backend.payment_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String orderId;

    @Column(nullable = false)
    private String userId;

    private String userEmail;

    @Column(nullable = false)
    private Double subtotal;
    private Double discountAmount;
    private Double codFee;

    @Column(nullable = false)
    private Double totalAmount;

    @Column(length = 1000)
    private String productNames;

//    @Enumerated(EnumType.STRING)
//    private PaymentMethod paymentMethod;

    private String couponCode;
    private String razorpayOrderId;    // only for UPI_RAZORPAY
    private String razorpayPaymentId;  // set after frontend confirms
    private String failureReason;
    private LocalDate estimatedDelivery;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); }
    @PreUpdate  protected void onUpdate()  { updatedAt = LocalDateTime.now(); }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod paymentMethod;

    public enum PaymentMethod {
        UPI_RAZORPAY,
        COD
    }

    public enum PaymentStatus {
        PENDING,
        SUCCESS,
        FAILED,
        COD_PENDING,
        COD_DELIVERED
    }
}

