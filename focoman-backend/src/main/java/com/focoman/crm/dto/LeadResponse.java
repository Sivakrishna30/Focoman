package com.focoman.crm.dto;

import java.time.LocalDate;

public record LeadResponse(
    String id,
    String studioId,
    String customerId,
    String customerName,
    String customerMobile,
    String customerEmail,
    String source,
    String eventType,
    LocalDate eventDate,
    String status,
    String notes,
    String assignedTo
) {}