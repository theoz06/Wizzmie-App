package com.wizzmie.server_app.DTO.Request;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuRequest {   

    private String name;
    private String description;
    private Double price;
    private Boolean isAvailable;

    @JsonProperty("category_id")
    private Integer categoryId;

}
