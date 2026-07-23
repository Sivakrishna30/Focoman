package com.focoman.auth.service;

import com.focoman.auth.dto.AuthResponse;
import com.focoman.auth.dto.JoinRequestResponse;
import com.focoman.auth.dto.MemberApplyRequest;
import com.focoman.auth.dto.MemberLoginRequest;
import com.focoman.auth.entity.MemberJoinRequestEntity;
import com.focoman.auth.entity.StudioEntity;
import com.focoman.auth.entity.UserEntity;
import com.focoman.auth.repository.MemberJoinRequestRepository;
import com.focoman.auth.repository.StudioRepository;
import com.focoman.auth.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class MemberAuthService {

    private final MemberJoinRequestRepository joinRequestRepository;
    private final StudioRepository studioRepository;
    private final UserRepository userRepository;
    private final Random random = new Random();

    public MemberAuthService(MemberJoinRequestRepository joinRequestRepository, StudioRepository studioRepository, UserRepository userRepository) {
        this.joinRequestRepository = joinRequestRepository;
        this.studioRepository = studioRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public AuthResponse applyForMembership(MemberApplyRequest request) {
        String targetStudioStr = request.studioId().trim();

        // Resolve studio by ID or Prefix
        Optional<StudioEntity> studioOpt = studioRepository.findById(targetStudioStr)
                .or(() -> studioRepository.findByPrefixIgnoreCase(targetStudioStr));

        if (studioOpt.isEmpty()) {
            return AuthResponse.failure("Target Studio '" + targetStudioStr + "' does not exist. Please check Studio ID or Prefix.");
        }

        StudioEntity studio = studioOpt.get();

        if (userRepository.existsByUsernameIgnoreCase(request.username())) {
            return AuthResponse.failure("Username '" + request.username() + "' is already taken.");
        }

        String requestId = "REQ-" + (1000 + random.nextInt(9000));
        String skillsStr = request.skills() != null ? String.join(",", request.skills()) : request.primaryExpertise();

        MemberJoinRequestEntity joinRequest = new MemberJoinRequestEntity(
                requestId,
                studio.getId(),
                request.name(),
                request.email(),
                request.mobile(),
                request.username(),
                request.password(),
                skillsStr,
                request.primaryExpertise(),
                "PENDING",
                OffsetDateTime.now()
        );

        joinRequestRepository.save(joinRequest);

        return AuthResponse.success(
                "Join request submitted to studio '" + studio.getBrandName() + "'. Awaiting Studio Owner approval.",
                requestId,
                studio.getId(),
                studio.getPrefix(),
                request.username(),
                request.name(),
                "CREW_MEMBER",
                "PENDING_APPROVAL",
                request.primaryExpertise()
        );
    }

    public AuthResponse loginMember(MemberLoginRequest request) {
        String username = request.username().trim();

        Optional<UserEntity> userOpt = userRepository.findByUsernameIgnoreCase(username)
                .or(() -> userRepository.findByEmailIgnoreCase(username))
                .or(() -> userRepository.findById(username));

        if (userOpt.isEmpty()) {
            return AuthResponse.failure("Crew member username '" + username + "' not found.");
        }

        UserEntity user = userOpt.get();

        if (!user.getPasswordHash().equals(request.password())) {
            return AuthResponse.failure("Invalid password for crew member.");
        }

        if ("PENDING_APPROVAL".equalsIgnoreCase(user.getStatus())) {
            return AuthResponse.failure("Your membership request is currently PENDING approval by your studio owner.");
        }

        if ("INACTIVE".equalsIgnoreCase(user.getStatus())) {
            return AuthResponse.failure("Your crew account has been deactivated by the studio owner.");
        }

        String prefix = "STU";
        Optional<StudioEntity> studioOpt = studioRepository.findById(user.getStudioId());
        if (studioOpt.isPresent()) {
            prefix = studioOpt.get().getPrefix();
        }

        return AuthResponse.success(
                "Crew member login successful",
                user.getId(),
                user.getStudioId(),
                prefix,
                user.getUsername(),
                user.getName(),
                user.getRole(),
                user.getStatus(),
                user.getPrimaryExpertise()
        );
    }

    public List<JoinRequestResponse> getPendingRequests(String studioId) {
        return joinRequestRepository.findByStudioId(studioId).stream()
                .map(req -> new JoinRequestResponse(
                        req.getId(),
                        req.getStudioId(),
                        req.getApplicantName(),
                        req.getEmail(),
                        req.getMobile(),
                        req.getUsername(),
                        req.getSkills() != null ? Arrays.asList(req.getSkills().split(",")) : List.of(),
                        req.getPrimaryExpertise(),
                        req.getStatus(),
                        req.getRequestedAt()
                ))
                .toList();
    }

    @Transactional
    public AuthResponse approveRequest(String requestId) {
        Optional<MemberJoinRequestEntity> reqOpt = joinRequestRepository.findById(requestId);
        if (reqOpt.isEmpty()) {
            return AuthResponse.failure("Join request '" + requestId + "' not found.");
        }

        MemberJoinRequestEntity req = reqOpt.get();
        req.setStatus("APPROVED");
        req.setReviewedAt(OffsetDateTime.now());
        joinRequestRepository.save(req);

        // Provision UserEntity
        String prefix = "STU";
        Optional<StudioEntity> studioOpt = studioRepository.findById(req.getStudioId());
        if (studioOpt.isPresent()) {
            prefix = studioOpt.get().getPrefix();
        }

        String memberId = prefix + "-MEM-" + (100 + random.nextInt(900));

        UserEntity memberUser = new UserEntity(
                memberId,
                req.getStudioId(),
                req.getUsername(),
                req.getApplicantName(),
                req.getEmail(),
                req.getMobile(),
                req.getPasswordHash(),
                "CREW_MEMBER",
                "ACTIVE",
                req.getSkills(),
                req.getPrimaryExpertise(),
                OffsetDateTime.now()
        );

        userRepository.save(memberUser);

        return AuthResponse.success(
                "Member request approved. Crew account provisioned for " + req.getApplicantName(),
                memberId,
                req.getStudioId(),
                prefix,
                req.getUsername(),
                req.getApplicantName(),
                "CREW_MEMBER",
                "ACTIVE",
                req.getPrimaryExpertise()
        );
    }

    @Transactional
    public AuthResponse rejectRequest(String requestId) {
        Optional<MemberJoinRequestEntity> reqOpt = joinRequestRepository.findById(requestId);
        if (reqOpt.isEmpty()) {
            return AuthResponse.failure("Join request '" + requestId + "' not found.");
        }

        MemberJoinRequestEntity req = reqOpt.get();
        req.setStatus("REJECTED");
        req.setReviewedAt(OffsetDateTime.now());
        joinRequestRepository.save(req);

        return AuthResponse.success("Join request rejected.", null, req.getStudioId(), null, req.getUsername(), req.getApplicantName(), "CREW_MEMBER", "REJECTED", null);
    }
}
