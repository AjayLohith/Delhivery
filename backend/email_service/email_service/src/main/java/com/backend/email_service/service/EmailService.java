package com.backend.email_service.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class
EmailService {
    private final JavaMailSender mailSender;

    @Value("${EMAIL_SENDER_BREVO}")
    private String fromEmail;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @PostConstruct
    public void test() {
        System.out.println("FROM = " + fromEmail);
    }

    @PostConstruct
    public void checkConfig() {
        log.info("SMTP USER = {}", System.getenv("EMAIL_USER_BREVO"));
        log.info("FROM EMAIL = {}", fromEmail);
    }


    public void sendOrderConfirmation(Map<?, ?> event) {
        try {
            String toEmail = (String) event.get("userEmail");
            String userId = (String) event.get("userId");
            String orderId = (String) event.get("orderId");
            String method = (String) event.get("paymentMethod");

            Object deliveryObj =  event.get("estimatedDelivery");
            String delivery=deliveryObj==null?"TBD":deliveryObj.toString();

            log.info("FROM EMAIL = {}", fromEmail);

            String coupon = (String) event.get("couponCode");

            Object subTotalObj = event.get("subtotal");
            double subtotal=subTotalObj==null?0.0:((Number)subTotalObj).doubleValue();

            double discount =
                    event.get("discountAmount") == null
                            ? 0.0
                            : ((Number) event.get("discountAmount"))
                            .doubleValue();

            double codFee =
                    event.get("codFee") == null
                            ? 0.0
                            : ((Number) event.get("codFee"))
                            .doubleValue();
//            double discount = ((Number) event.get("discountAmount")).doubleValue();
//            double codFee = ((Number) event.get("codFee")).doubleValue();
            double total = ((Number) event.get("totalAmount")).doubleValue();


            @SuppressWarnings("unchecked")
            List<Map<String, Object>> items = (List<Map<String, Object>>) event.get("items");


            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(fromEmail);
            msg.setTo(toEmail);
            msg.setSubject("Order Confirmed - " + orderId + " | Rs." + total);

            StringBuilder body = new StringBuilder();
            body.append("Hello ").append(userId).append(",\n\n");
            body.append("Your order has been placed successfully!\n");
            body.append("=".repeat(45)).append("\n\n");

            body.append("ORDER ID   : ").append(orderId).append("\n");
            body.append("PAYMENT    : ").append("COD".equalsIgnoreCase(method)
                    ? "Cash on Delivery" : "UPI / Razorpay").append("\n");

            body.append("DELIVERY   : ").append(delivery).append("\n\n");

            body.append("ITEMS ORDERED:\n");
            body.append("-".repeat(45)).append("\n");
            if (items != null) {
                for (Map<String, Object> item : items) {
                    String name = (String) item.get("productName");
                    int qty = ((Number) item.get("quantity")).intValue();
                    double price = ((Number) item.get("price")).doubleValue();
                    double itemTotal = ((Number) item.get("totalPrice")).doubleValue();
                    body.append(String.format("%-22s x%d  @ Rs.%-8.2f = Rs.%.2f%n",
                            name, qty, price, itemTotal));
                }
            }
            body.append("-".repeat(45)).append("\n");
            body.append(String.format("Subtotal                             Rs.%.2f%n", subtotal));
            if (discount > 0) {
                body.append(String.format("Coupon (%s)                    - Rs.%.2f%n", coupon, discount));
            }
            if (codFee > 0) {
                body.append(String.format("COD Handling Fee                  + Rs.%.2f%n", codFee));
            }
            body.append("=".repeat(45)).append("\n");
            body.append(String.format("TOTAL PAYABLE                        Rs.%.2f%n", total));
            body.append("=".repeat(45)).append("\n\n");

            if ("COD".equalsIgnoreCase(method)) {
                body.append("Please keep Rs.").append(String.format("%.2f", total))
                        .append(" ready to pay the delivery person.\n\n");
            } else {
                body.append("Payment received via UPI/Razorpay.\n\n");
            }

            body.append("You can track your order at:\n");
            body.append(frontendUrl).append("/orders/").append(orderId).append("\n\n");
            body.append("Thank you for shopping with us!\n");
            body.append("— E-Commerce Team");

            msg.setText(body.toString());
            mailSender.send(msg);
            log.info("Confirmation email sent to {} for order {}", toEmail, orderId);

        } catch (Exception e) {
            log.error("Email send failed for order {}: {}", event.get("orderId"), e.getMessage(), e);
        }

//            SimpleMailMessage message=new SimpleMailMessage();
//            message.setFrom(fromEmail);
//            message.setTo(toEmail);
//            message.setSubject("Order confirmed - "+orderId);
//
//            StringBuilder body=new StringBuilder();
//            body.append("Hello ").append(userId).append(",\n\n");
//            body.append("Your order has been placed successfully!\n\n");
//            body.append("Order ID: ").append(orderId).append("\n");
//            body.append("Total    :Rs.").append(amount).append("\n\n");
//            body.append("Items ordered:\n");
//            body.append("-".repeat(40)).append("\n");
//
//            for(Map<String,Object>item:items){
//                body.append(". ").append(item.get("productName"))
//                        .append(" x").append(item.get("quantity"))
//                        .append(" =Rs.").append(item.get("totalPrice"))
//                        .append("\n");
//            }
//            body.append("-".repeat(40)).append("\n");
//            body.append("\nThank you for shopping with us!\n");
//            body.append("\n— E-Commerce Team");
//
//            message.setText(body.toString());
//            mailSender.send(message);
//            log.info("Order confirmation email sent to: {} for orderId: {}", toEmail, orderId);
//        }
//        catch (Exception e) {
//            log.error("Failed to send email to: {} for orderId: {}", toEmail, orderId, e);
//        }
//    }
    }
}
