package com.wizzmie.server_app.DTO.Respon;

import com.wizzmie.server_app.Entity.Menu;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MenuRecommendationResponse {
    private Menu menu;
    private Double score;
}
