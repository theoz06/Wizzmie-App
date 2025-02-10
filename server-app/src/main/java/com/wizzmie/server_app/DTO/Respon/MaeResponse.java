package com.wizzmie.server_app.DTO.Respon;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaeResponse {
    private double contentBasedMae;
    private double collaborativeMae;
    private double hybridMae;
}
