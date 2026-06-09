package com.backend.email_service.service;

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
public class EmailService {
    private final JavaMailSender mailSender;

    @Value("${EMAIL_HOST_BREVO}")
    private String fromEmail;

    public void sendOrderConfirmation(String toEmail,
                                      String userId,
                                      String orderId,
                                      Double amount,
                                      List<Map<String, Object>> items) {
        try{
            SimpleMailMessage message=new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Order confirmed - "+orderId);

            StringBuilder body=new StringBuilder();
            body.append("Hello ").append(userId).append(",\n\n");
            body.append("Your order has been placed successfully!\n\n");
            body.append("Order ID: ").append(orderId).append("\n");
            body.append("Total    :Rs.").append(amount).append("\n\n");
            body.append("Items ordered:\n");
            body.append("-".repeat(40)).append("\n");

            for(Map<String,Object>item:items){
                body.append(". ").append(item.get("productName"))
                        .append(" x").append(item.get("quantity"))
                        .append(" =Rs.").append(item.get("totalPrice"))
                        .append("\n");
            }
            body.append("-".repeat(40)).append("\n");
            body.append("\nThank you for shopping with us!\n");
            body.append("\n— E-Commerce Team");

            message.setText(body.toString());
            mailSender.send(message);
            log.info("Order confirmation email sent to: {} for orderId: {}", toEmail, orderId);
        }
        catch (Exception e) {
            log.error("Failed to send email to: {} for orderId: {}", toEmail, orderId, e);
        }
    }
}
