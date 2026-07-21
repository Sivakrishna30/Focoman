package com.focoman.oms.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public record OrderResponse(
        UUID orderId,
        String customerName,
        String eventType,
        LocalDate eventDate,
        String status,
        String assignedEmployee,
        BigDecimal amount,
        OffsetDateTime createdDate,
        OffsetDateTime lastUpdated,
        UUID studioId,
        UUID customerId,
        UUID employeeId
) {
}
