package com.focoman.auth.dto;

public record AuthResponse(
        boolean success,
        String message,
        String token,
        String userId,
        String studioId,
        String studioPrefix,
        String username,
        String name,
        String role,
        String status,
        String primaryExpertise
) {
    public static AuthResponse success(String message, String userId, String studioId, String studioPrefix, String username, String name, String role, String status, String primaryExpertise) {
        return new AuthResponse(true, message, "mock-jwt-token-" + userId, userId, studioId, studioPrefix, username, name, role, status, primaryExpertise);
    }

    public static AuthResponse failure(String message) {
        return new AuthResponse(false, message, null, null, null, null, null, null, null, null, null);
    }
}
