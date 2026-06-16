package com.backend.email_service.kafka;

import com.backend.email_service.service.EmailService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailEventConsumer {
    private final EmailService emailService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "order-placed-topic",groupId = "email-group")
    public void handleOrderPlaced(String message){
        try{
            log.info("Emailconsumer recieved message:{}",message);
            Map<?,?>event=objectMapper.readValue(message,Map.class);

//            log.info("Sending confirmation email to: {} for orderId: {}",userEmail,orderId);
            emailService.sendOrderConfirmation(event);
        }
        catch (Exception e){
            log.error("Failed to process event in EmailConsumer :{}",e.getMessage(),e);
        }
    }
}
