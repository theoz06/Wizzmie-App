package com.wizzmie.server_app.Services.Implements;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.wizzmie.server_app.Entity.Helper.DashboardMetricsDTO;
import com.wizzmie.server_app.Repository.OrderRepository;
import com.wizzmie.server_app.Services.DashboardService;

@Service
public class DashboardServiceImpl implements DashboardService {
    private final OrderRepository orderRepository;

    public DashboardServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public DashboardMetricsDTO getDashboardMetrics() {
        LocalDate now = LocalDate.now();
        int month = now.getMonthValue();
        int year = now.getYear();
        Boolean paid = true; 

        BigDecimal totalSalesMonthly = orderRepository.getTotalSalesByMonthAndYear(month, year, paid);
        Long totalCustomersMonthly = orderRepository.getTotalCustomersByMonthAndYear(month, year, paid);
        BigDecimal totalSalesYearly = orderRepository.getTotalSalesByYear(year, paid);

        return new DashboardMetricsDTO(
                totalSalesMonthly != null ? totalSalesMonthly : BigDecimal.ZERO,
                totalSalesYearly != null ? totalSalesYearly : BigDecimal.ZERO,
                totalCustomersMonthly != null ? totalCustomersMonthly : 0L
        );
    }
}