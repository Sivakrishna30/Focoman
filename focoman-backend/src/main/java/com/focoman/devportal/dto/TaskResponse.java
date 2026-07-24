package com.focoman.devportal.dto;

import java.time.OffsetDateTime;

public record TaskResponse(
    String id,
    String title,
    String description,
    String type,
    String priority,
    String status,
    String assignedTo,
    String reportedBy,
    String module,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {}