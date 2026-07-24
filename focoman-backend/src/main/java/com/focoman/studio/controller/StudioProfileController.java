package com.focoman.studio.controller;

import com.focoman.auth.entity.StudioEntity;
import com.focoman.auth.entity.UserEntity;
import com.focoman.auth.repository.StudioRepository;
import com.focoman.auth.repository.UserRepository;
import com.focoman.studio.dto.StudioProfileResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/studios")
@CrossOrigin(origins = "*")
public class StudioProfileController {
    private final StudioRepository studioRepository;
    private final UserRepository userRepository;
    public StudioProfileController(StudioRepository studioRepository, UserRepository userRepository) { this.studioRepository = studioRepository; this.userRepository = userRepository; }
    @GetMapping("/{prefix}")
    public ResponseEntity<StudioProfileResponse> getByPrefix(@PathVariable String prefix) {
        return studioRepository.findByPrefixIgnoreCase(prefix).map(studio -> {
            String ownerName = userRepository.findByStudioId(studio.getId()).stream().filter(user -> "STUDIO_OWNER".equals(user.getRole())).map(UserEntity::getName).findFirst().orElse("Studio Owner");
            return ResponseEntity.ok(new StudioProfileResponse(studio.getId(), studio.getPrefix(), studio.getName(), studio.getBrandName(), ownerName, studio.getCity()));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
