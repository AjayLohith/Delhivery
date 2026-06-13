package com.backend.cart_service.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "PRODUCT-SERVICE")
public interface ProductClient{
    @PatchMapping("/api/products/{productId}/decrement-stock")
    Boolean decrementStock(
            @PathVariable("productId")Long productId,
            @RequestParam("quantity")Integer quantity
    );
}
