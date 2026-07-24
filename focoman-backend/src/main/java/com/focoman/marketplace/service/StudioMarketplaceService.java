package com.focoman.marketplace.service;

import com.focoman.auth.entity.StudioEntity;
import com.focoman.auth.repository.StudioRepository;
import com.focoman.marketplace.dto.MarketplaceStudioResponse;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StudioMarketplaceService {
    private final StudioRepository studioRepository;
    public StudioMarketplaceService(StudioRepository studioRepository) { this.studioRepository = studioRepository; }
    public List<MarketplaceStudioResponse> findStudios(String city) {
        List<StudioEntity> studios = city == null || city.isBlank() ? studioRepository.findAllByOrderByBrandNameAsc() : studioRepository.findByCityIgnoreCaseOrderByBrandNameAsc(city.trim());
        return studios.stream().map(this::toResponse).toList();
    }
    private MarketplaceStudioResponse toResponse(StudioEntity studio) {
        return new MarketplaceStudioResponse(studio.getId(), studio.getBrandName(), studio.getName(), studio.getCity(), studio.getEmail(), studio.getMobile(), studio.getPrefix());
    }
}
