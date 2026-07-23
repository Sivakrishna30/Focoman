package com.focoman.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record StudioLoginRequest(
        @NotBlank(message = "Email/Username or Studio ID is required")
        String identifier,

        @NotBlank(message = "Password is required")
        String password
) {
}
