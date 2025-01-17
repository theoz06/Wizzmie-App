package com.wizzmie.server_app.Controllers.Implements;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wizzmie.server_app.DTO.Respon.MenuRecommendationResponse;
import com.wizzmie.server_app.Services.Implements.HybridRecommendationService;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {
    
    private final HybridRecommendationService recommendationService;
    
    public RecommendationController(HybridRecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }
    
    @GetMapping("/{customerId}")
    public List<MenuRecommendationResponse> getRecommendations(
            @PathVariable Integer customerId,
            @RequestParam(defaultValue = "10") int limit) {
        return recommendationService.getRecommendations(customerId, limit);
    }
}
