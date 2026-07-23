package com.focoman.auth;

import com.focoman.auth.dto.*;
import com.focoman.auth.service.MemberAuthService;
import com.focoman.auth.service.StudioAuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class MemberAuthServiceTest {

    @Autowired
    private MemberAuthService memberAuthService;

    @Autowired
    private StudioAuthService studioAuthService;

    private String studioId;

    @BeforeEach
    void setUp() {
        StudioRegisterRequest reg = new StudioRegisterRequest(
                "Focus Vision Studio", "Focus Vision", "Karan Johar", "karan@focusvision.com",
                "+91 97777 66666", "Delhi", "FOC", "karan_owner", "pass123"
        );
        AuthResponse res = studioAuthService.registerStudio(reg);
        this.studioId = res.studioId();
    }

    @Test
    @DisplayName("Should allow a crew member to submit a join request with skills and primary expertise")
    void testApplyForMembership() {
        MemberApplyRequest applyReq = new MemberApplyRequest(
                studioId,
                "Rohan Verma",
                "rohan@gmail.com",
                "+91 91111 22222",
                "rohan_lens",
                "crewPass123",
                List.of("Candid Photography", "4K Videography", "Drone Operation"),
                "Candid Photography"
        );

        AuthResponse response = memberAuthService.applyForMembership(applyReq);

        assertTrue(response.success());
        assertEquals("PENDING_APPROVAL", response.status());
        assertNotNull(response.userId()); // Request ID
    }

    @Test
    @DisplayName("Should prevent login if membership is pending studio owner approval")
    void testLoginPendingMember() {
        MemberApplyRequest applyReq = new MemberApplyRequest(
                studioId, "Suresh Kumar", "suresh@gmail.com", "+91 92222 33333",
                "suresh_cam", "pass123", List.of("Photo Editing"), "Photo Editing"
        );
        memberAuthService.applyForMembership(applyReq);

        MemberLoginRequest loginReq = new MemberLoginRequest("suresh_cam", "pass123");
        AuthResponse loginRes = memberAuthService.loginMember(loginReq);

        assertFalse(loginRes.success());
        assertTrue(loginRes.message().contains("not found") || loginRes.message().contains("PENDING"));
    }

    @Test
    @DisplayName("Should allow studio owner to approve member request, provisioning an active user account")
    void testApproveMemberRequest() {
        MemberApplyRequest applyReq = new MemberApplyRequest(
                studioId, "Pooja Hegde", "pooja@gmail.com", "+91 93333 44444",
                "pooja_edit", "pass123", List.of("Album Design", "Photo Editing"), "Album Design"
        );
        AuthResponse applyRes = memberAuthService.applyForMembership(applyReq);
        String requestId = applyRes.userId();

        List<JoinRequestResponse> pending = memberAuthService.getPendingRequests(studioId);
        assertEquals(1, pending.size());

        AuthResponse approveRes = memberAuthService.approveRequest(requestId);
        assertTrue(approveRes.success());
        assertEquals("ACTIVE", approveRes.status());

        // Now test login for approved member
        MemberLoginRequest loginReq = new MemberLoginRequest("pooja_edit", "pass123");
        AuthResponse loginRes = memberAuthService.loginMember(loginReq);

        assertTrue(loginRes.success());
        assertEquals("ACTIVE", loginRes.status());
        assertEquals("Album Design", loginRes.primaryExpertise());
    }
}
