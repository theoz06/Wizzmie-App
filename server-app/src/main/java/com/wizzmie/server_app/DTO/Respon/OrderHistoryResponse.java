package com.wizzmie.server_app.DTO.Respon;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderHistoryResponse {
    private Integer order_id;
    private String customer;
    private Integer tableNumber;
    private Double totalAmount;
    private UserDto updatedBy;
}
