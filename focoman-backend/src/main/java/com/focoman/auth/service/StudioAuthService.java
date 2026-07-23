package com.focoman.auth.service;

import com.focoman.auth.dto.AuthResponse;
import com.focoman.auth.dto.StudioLoginRequest;
import com.focoman.auth.dto.StudioRegisterRequest;
import com.focoman.auth.entity.StudioEntity;
import com.focoman.auth.entity.UserEntity;
import com.focoman.auth.repository.StudioRepository;
import com.focoman.auth.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class StudioAuthService {

    private final StudioRepository studioRepository;
    private final UserRepository userRepository;
    private final Random random = new Random();

    public StudioAuthService(StudioRepository studioRepository, UserRepository userRepository) {
        this.studioRepository = studioRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public AuthResponse registerStudio(StudioRegisterRequest request) {
        String prefix = request.prefix().trim().toUpperCase();

        if (studioRepository.existsByPrefixIgnoreCase(prefix)) {
            return AuthResponse.failure("Studio prefix '" + prefix + "' is already taken. Please choose a different unique prefix.");
        }

        if (studioRepository.existsByEmailIgnoreCase(request.email())) {
            return AuthResponse.failure("Email address '" + request.email() + "' is already registered with another studio.");
        }

        if (userRepository.existsByUsernameIgnoreCase(request.username())) {
            return AuthResponse.failure("Username '" + request.username() + "' is already taken.");
        }

        // Generate Studio ID STU-<6 digit number>
        int randomNumber = 100000 + random.nextInt(900000);
        String studioId = prefix + "-" + randomNumber;

        StudioEntity studio = new StudioEntity(
                studioId,
                prefix,
                request.studioName(),
                request.brandName(),
                request.email(),
                request.mobile(),
                request.city(),
                OffsetDateTime.now()
        );
        studioRepository.save(studio);

        // Generate Studio Owner User ID
        String userId = prefix + "-ADM-001";
        UserEntity ownerUser = new UserEntity(
                userId,
                studioId,
                request.username(),
                request.ownerName(),
                request.email(),
                request.mobile(),
                request.password(), // Plain text for dev/mock, easy matching
                "STUDIO_OWNER",
                "ACTIVE",
                "Studio Management, Lead Management, Team ERP",
                "Studio Management",
                OffsetDateTime.now()
        );
        userRepository.save(ownerUser);

        return AuthResponse.success(
                "Studio account created successfully! Studio ID: " + studioId,
                userId,
                studioId,
                prefix,
                request.username(),
                request.ownerName(),
                "STUDIO_OWNER",
                "ACTIVE",
                "Studio Management"
        );
    }

    public AuthResponse loginStudio(StudioLoginRequest request) {
        String identifier = request.identifier().trim();

        // Search user by username, email, or user ID
        Optional<UserEntity> userOpt = userRepository.findByUsernameIgnoreCase(identifier)
                .or(() -> userRepository.findByEmailIgnoreCase(identifier))
                .or(() -> userRepository.findById(identifier));

        if (userOpt.isEmpty()) {
            // Check if identifier matches studio email or studio ID
            Optional<StudioEntity> studioOpt = studioRepository.findByEmailIgnoreCase(identifier)
                    .or(() -> studioRepository.findById(identifier));

            if (studioOpt.isPresent()) {
                StudioEntity studio = studioOpt.get();
                // Find owner of studio
                userOpt = userRepository.findByStudioId(studio.getId()).stream().findFirst();
            }
        }

        if (userOpt.isEmpty()) {
            return AuthResponse.failure("Invalid credentials. No studio or admin found for '" + identifier + "'.");
        }

        UserEntity user = userOpt.get();

        if (!user.getPasswordHash().equals(request.password())) {
            return AuthResponse.failure("Invalid password provided.");
        }

        String prefix = "STU";
        Optional<StudioEntity> studioOpt = studioRepository.findById(user.getStudioId());
        if (studioOpt.isPresent()) {
            prefix = studioOpt.get().getPrefix();
        }

        return AuthResponse.success(
                "Studio login successful",
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
}
