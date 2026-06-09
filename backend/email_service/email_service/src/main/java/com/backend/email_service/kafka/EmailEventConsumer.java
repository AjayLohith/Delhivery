package com.backend.email_service.kafka;

import com.backend.email_service.service.EmailService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.LifecycleState;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailEventConsumer {
    private final EmailService emailService;
    private final ObjectMapper objectMapper;

    public void handleOrderPlaced(String message){
        try{
            log.info("Emailconsumer recieved message:{}",message);
            Map<?,?>event=objectMapper.readValue(message,Map.class);
            String orderId= (String) event.get("orderId");
            String userId= (String) event.get("userId");
            String userEmail=(String) event.get("userEmail");
            Double amount=((Number) event.get("totalAmount")).doubleValue();

            @SuppressWarnings("unchecked")
            List<Map<String,Object>>items= (List<Map<String, Object>>) event.get("items");
            log.info("Sending confirmation email to: {} for orderId: {}",userEmail,orderId);
            emailService.sendOrderConfirmation(userEmail,userId,orderId,amount,items);
        }
        catch (Exception e){
            log.error("Failed to process event in EmailConsumer :{}",e.getMessage(),e);
        }
    }
}
