package com.focoman.auth.controller;

import com.focoman.auth.dto.AuthResponse;
import com.focoman.auth.dto.JoinRequestResponse;
import com.focoman.auth.dto.MemberApplyRequest;
import com.focoman.auth.dto.MemberLoginRequest;
import com.focoman.auth.service.MemberAuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth/member")
@CrossOrigin(origins = "*")
public class MemberAuthController {

    private final MemberAuthService memberAuthService;

    public MemberAuthController(MemberAuthService memberAuthService) {
        this.memberAuthService = memberAuthService;
    }

    @PostMapping("/apply")
    public ResponseEntity<AuthResponse> applyForMembership(@Valid @RequestBody MemberApplyRequest request) {
        AuthResponse response = memberAuthService.applyForMembership(request);
        if (response.success()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginMember(@Valid @RequestBody MemberLoginRequest request) {
        AuthResponse response = memberAuthService.loginMember(request);
        if (response.success()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/requests/{studioId}")
    public ResponseEntity<List<JoinRequestResponse>> getPendingRequests(@PathVariable String studioId) {
        return ResponseEntity.ok(memberAuthService.getPendingRequests(studioId));
    }

    @PostMapping("/requests/{requestId}/approve")
    public ResponseEntity<AuthResponse> approveRequest(@PathVariable String requestId) {
        AuthResponse response = memberAuthService.approveRequest(requestId);
        if (response.success()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/requests/{requestId}/reject")
    public ResponseEntity<AuthResponse> rejectRequest(@PathVariable String requestId) {
        AuthResponse response = memberAuthService.rejectRequest(requestId);
        if (response.success()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}
