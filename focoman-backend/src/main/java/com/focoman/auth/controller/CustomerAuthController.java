package com.focoman.auth.controller;

import com.focoman.auth.dto.AuthResponse;
import com.focoman.auth.dto.CustomerLoginRequest;
import com.focoman.auth.dto.CustomerRegisterRequest;
import com.focoman.auth.service.CustomerAuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/customer")
@CrossOrigin(origins = "*")
public class CustomerAuthController {

    private final CustomerAuthService customerAuthService;

    public CustomerAuthController(CustomerAuthService customerAuthService) {
        this.customerAuthService = customerAuthService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerCustomer(@Valid @RequestBody CustomerRegisterRequest request) {
        AuthResponse response = customerAuthService.registerCustomer(request);
        if (response.success()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginCustomer(@Valid @RequestBody CustomerLoginRequest request) {
        AuthResponse response = customerAuthService.loginCustomer(request);
        if (response.success()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}
