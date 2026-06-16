package com.backend.cart_service.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderEvent implements Serializable {
    private String orderId;
    private String userId;
    private String userEmail;
    private List<CartItem> items;
    private Double subtotal;           // cart total before coupon/COD
    private Double discountAmount;     // coupon discount applied
    private Double codFee;             // 10.0 if COD, else 0.0
    private Double totalAmount;        // final amount: subtotal - discount + codFee
    private String paymentMethod;      // "UPI_RAZORPAY" or "COD"
    private String couponCode;         // null if none
    private String status;             // "PLACED"
    private LocalDate estimatedDelivery;
}

