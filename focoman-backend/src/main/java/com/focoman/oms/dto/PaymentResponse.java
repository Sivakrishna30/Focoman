package com.focoman.oms.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record PaymentResponse(
    UUID id,
    String studioId,
    UUID orderId,
    BigDecimal amount,
    String paymentType,
    String paymentMode,
    String paymentStatus,
    OffsetDateTime paidAt,
    String notes
) {}