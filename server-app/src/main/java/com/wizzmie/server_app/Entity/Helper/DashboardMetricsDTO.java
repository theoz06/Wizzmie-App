package com.wizzmie.server_app.Entity.Helper;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardMetricsDTO {
    private BigDecimal totalSalesMonthly;
    private BigDecimal totalSalesYearly;
    private Long totalCustomersMonthly;
}
