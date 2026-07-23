package com.focoman.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record CustomerLoginRequest(
        @NotBlank(message = "Username or Email is required")
        String identifier,

        @NotBlank(message = "Password is required")
        String password
) {
}
