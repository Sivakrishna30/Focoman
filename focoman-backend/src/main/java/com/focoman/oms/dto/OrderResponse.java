package com.focoman.oms.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public record OrderResponse(
        UUID orderId,
        String displayId,
        String studioId,
        String customerName,
        String customerMobile,
        String eventType,
        LocalDate eventDate,
        String status,
        String assignedEmployee,
        String assignedEmployeeId,
        BigDecimal amount,
        OffsetDateTime createdDate,
        OffsetDateTime lastUpdated
) {}
