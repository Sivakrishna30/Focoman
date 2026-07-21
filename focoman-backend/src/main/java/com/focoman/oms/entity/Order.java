package com.focoman.oms.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public record Order(
        UUID orderId,
        String customerName,
        String eventType,
        LocalDate eventDate,
        OrderStatus status,
        String assignedEmployee,
        BigDecimal amount,
        OffsetDateTime createdDate,
        OffsetDateTime lastUpdated,
        UUID studioId,
        UUID customerId,
        UUID employeeId
) {
}
