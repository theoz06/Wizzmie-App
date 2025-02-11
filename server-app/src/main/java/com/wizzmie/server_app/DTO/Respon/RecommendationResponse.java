package com.wizzmie.server_app.DTO.Respon;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationResponse {
    private List<MenuRecommendationResponse> recommendations;
    private MaeResponse mae;
}
