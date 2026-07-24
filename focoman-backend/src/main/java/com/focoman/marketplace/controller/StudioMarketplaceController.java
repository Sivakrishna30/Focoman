package com.focoman.marketplace.controller;

import com.focoman.marketplace.dto.MarketplaceStudioResponse;
import com.focoman.marketplace.service.StudioMarketplaceService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/marketplace/studios")
@CrossOrigin(origins = "*")
public class StudioMarketplaceController {
    private final StudioMarketplaceService studioMarketplaceService;
    public StudioMarketplaceController(StudioMarketplaceService studioMarketplaceService) { this.studioMarketplaceService = studioMarketplaceService; }
    @GetMapping
    public List<MarketplaceStudioResponse> findStudios(@RequestParam(required = false) String city) { return studioMarketplaceService.findStudios(city); }
}
