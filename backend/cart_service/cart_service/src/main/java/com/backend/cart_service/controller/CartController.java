package com.backend.cart_service.controller;

import com.backend.cart_service.model.CartItem;
import com.backend.cart_service.model.CheckoutRequest;
import com.backend.cart_service.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @PostMapping("{userId}/add")
    public ResponseEntity<CartItem>addToCart(@PathVariable String userId,
                                             @RequestBody CartItem cartItem){
        return ResponseEntity.ok(cartService.addToCart(userId,cartItem));
    }
    @GetMapping("{userId}")
    public ResponseEntity<List<CartItem>>getCart(@PathVariable String userId){
        return ResponseEntity.ok(cartService.getCart(userId));
    }
    @DeleteMapping("{userId}/remove/{productId}")
    public ResponseEntity<Map<String,String>> removeItem(@PathVariable String userId,
                                                         @PathVariable Long productId){
        cartService.removeFromCart(userId,productId);
        return ResponseEntity.ok(Map.of("message","Item removed from cart"));
    }
    @DeleteMapping("{userId}/clear")
    public ResponseEntity<Map<String,String>>clearCart(@PathVariable String userId){
        cartService.clearCart(userId);
        return ResponseEntity.ok(Map.of("message","Cart Cleared"));
    }
    @PostMapping("{userId}/checkout")
    public ResponseEntity<Map<String,String>>checkOut(@PathVariable String userId,
                                                      @RequestBody CheckoutRequest request){
        String result=cartService.checkOut(userId,request);
        return ResponseEntity.ok(Map.of("message",result));
    }
}
