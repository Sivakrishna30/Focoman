package com.focoman.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record StudioRegisterRequest(
        @NotBlank(message = "Studio name is required")
        String studioName,

        @NotBlank(message = "Brand name is required")
        String brandName,

        @NotBlank(message = "Owner name is required")
        String ownerName,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "Mobile number is required")
        String mobile,

        String city,

        @NotBlank(message = "Studio prefix is required")
        @Size(min = 2, max = 6, message = "Prefix must be 2-6 uppercase characters")
        String prefix,

        @NotBlank(message = "Username is required")
        String username,

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        String password
) {
}
