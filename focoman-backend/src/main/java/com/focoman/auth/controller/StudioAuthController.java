package com.focoman.auth.controller;

import com.focoman.auth.dto.AuthResponse;
import com.focoman.auth.dto.StudioLoginRequest;
import com.focoman.auth.dto.StudioRegisterRequest;
import com.focoman.auth.service.StudioAuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/studio")
@CrossOrigin(origins = "*")
public class StudioAuthController {

    private final StudioAuthService studioAuthService;

    public StudioAuthController(StudioAuthService studioAuthService) {
        this.studioAuthService = studioAuthService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerStudio(@Valid @RequestBody StudioRegisterRequest request) {
        AuthResponse response = studioAuthService.registerStudio(request);
        if (response.success()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginStudio(@Valid @RequestBody StudioLoginRequest request) {
        AuthResponse response = studioAuthService.loginStudio(request);
        if (response.success()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}
