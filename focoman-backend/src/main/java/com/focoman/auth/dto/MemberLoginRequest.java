package com.focoman.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record MemberLoginRequest(
        @NotBlank(message = "Username or Crew handle is required")
        String username,

        @NotBlank(message = "Password is required")
        String password
) {
}
