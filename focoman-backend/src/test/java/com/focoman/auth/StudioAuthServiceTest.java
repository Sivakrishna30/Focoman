package com.focoman.auth;

import com.focoman.auth.dto.AuthResponse;
import com.focoman.auth.dto.StudioLoginRequest;
import com.focoman.auth.dto.StudioRegisterRequest;
import com.focoman.auth.service.StudioAuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class StudioAuthServiceTest {

    @Autowired
    private StudioAuthService studioAuthService;

    @Test
    @DisplayName("Should successfully register a new studio with unique prefix and auto-generated Studio ID")
    void testRegisterStudioSuccess() {
        StudioRegisterRequest request = new StudioRegisterRequest(
                "Aura Moments Photography",
                "Aura Moments",
                "Anita Sharma",
                "anita@auramoments.com",
                "+91 98123 45678",
                "Bengaluru",
                "AUR",
                "anita_admin",
                "pass12345"
        );

        AuthResponse response = studioAuthService.registerStudio(request);

        assertTrue(response.success());
        assertNotNull(response.studioId());
        assertTrue(response.studioId().startsWith("AUR-"));
        assertEquals("AUR", response.studioPrefix());
        assertEquals("STUDIO_OWNER", response.role());
    }

    @Test
    @DisplayName("Should reject studio registration if prefix is already taken")
    void testRegisterStudioDuplicatePrefix() {
        StudioRegisterRequest req1 = new StudioRegisterRequest(
                "Studio One", "Studio One Brand", "Owner One", "owner1@studio.com",
                "+91 99999 11111", "Chennai", "RAJ", "owner1", "password123"
        );
        studioAuthService.registerStudio(req1);

        StudioRegisterRequest req2 = new StudioRegisterRequest(
                "Studio Two", "Studio Two Brand", "Owner Two", "owner2@studio.com",
                "+91 99999 22222", "Hyderabad", "RAJ", "owner2", "password123"
        );

        AuthResponse response = studioAuthService.registerStudio(req2);
        assertFalse(response.success());
        assertTrue(response.message().contains("already taken"));
    }

    @Test
    @DisplayName("Should successfully login studio owner with valid credentials")
    void testLoginStudioSuccess() {
        StudioRegisterRequest reg = new StudioRegisterRequest(
                "Pixel Magic Studio", "Pixel Magic", "David Miller", "david@pixelmagic.com",
                "+91 98888 77777", "Mumbai", "PIX", "david_pixel", "secretPass123"
        );
        studioAuthService.registerStudio(reg);

        StudioLoginRequest loginRequest = new StudioLoginRequest("david_pixel", "secretPass123");
        AuthResponse loginResponse = studioAuthService.loginStudio(loginRequest);

        assertTrue(loginResponse.success());
        assertEquals("david_pixel", loginResponse.username());
        assertEquals("PIX", loginResponse.studioPrefix());
    }
}
