package com.backend.cart_service.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderEvent implements Serializable {
    private String userId;
    private String userEmail;
    private List<CartItem> items;
    private Double totalAmount;
    private String status;
    private String orderId;
}

