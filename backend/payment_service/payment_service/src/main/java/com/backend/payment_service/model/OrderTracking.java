package com.backend.payment_service.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

// One record per status change — used to show the tracking timeline to user.
@Entity @Table(name = "order_tracking")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderTracking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String orderId;

    @Column(nullable = false)
    private String status;   // e.g. "ORDER PLACED", "PAYMENT CONFIRMED", "SHIPPED", "DELIVERED"

    private String description;

    @Column(updatable = false)
    private LocalDateTime timestamp;

    @PrePersist protected void onCreate() { timestamp = LocalDateTime.now(); }
}
