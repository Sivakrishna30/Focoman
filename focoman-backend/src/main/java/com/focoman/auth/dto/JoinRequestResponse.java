package com.focoman.auth.dto;

import java.time.OffsetDateTime;
import java.util.List;

public record JoinRequestResponse(
        String requestId,
        String studioId,
        String applicantName,
        String email,
        String mobile,
        String username,
        List<String> skills,
        String primaryExpertise,
        String status,
        OffsetDateTime requestedAt
) {
}
