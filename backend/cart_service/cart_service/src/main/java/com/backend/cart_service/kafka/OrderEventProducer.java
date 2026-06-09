package com.backend.cart_service.kafka;

import com.backend.cart_service.model.OrderEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderEventProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Value("${kafka.topic.order-placed}")
    private String orderPlacedTopic;

    public void sendOrderEvent(OrderEvent event) {
        String json;
        try {
            json = objectMapper.writeValueAsString(event);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize OrderEvent for user: {}", event.getUserId(), e);
            throw new RuntimeException("Kafka serialization failed", e);
        }

        CompletableFuture<SendResult<String, String>> future =
                kafkaTemplate.send(orderPlacedTopic, event.getUserId(), json);

        future.whenComplete((result, ex) -> {
            if (ex == null) {
                log.info("OrderEvent sent -> topic[{}] partition[{}] offset[{}] user[{}]",
                        orderPlacedTopic,
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset(),
                        event.getUserId());
            } else {
                log.error("Failed to send OrderEvent for user[{}]: {}", event.getUserId(), ex.getMessage());
            }
        });
    }
}

