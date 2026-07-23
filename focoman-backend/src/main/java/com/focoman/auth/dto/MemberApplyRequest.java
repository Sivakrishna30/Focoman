package com.focoman.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record MemberApplyRequest(
        @NotBlank(message = "Studio ID or Prefix is required")
        String studioId,

        @NotBlank(message = "Full name is required")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "Mobile number is required")
        String mobile,

        @NotBlank(message = "Username is required")
        String username,

        @NotBlank(message = "Password is required")
        String password,

        List<String> skills,

        @NotBlank(message = "Primary expertise is required")
        String primaryExpertise
) {
}
