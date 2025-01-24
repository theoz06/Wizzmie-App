package com.wizzmie.server_app.Controllers.Implements;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

import com.wizzmie.server_app.Entity.Helper.DashboardMetricsDTO;
import com.wizzmie.server_app.Services.Implements.DashboardServiceImpl;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardControllerImpl {

    @Autowired
    private DashboardServiceImpl dashboardServiceImpl;


    @GetMapping("/metrics")
    public DashboardMetricsDTO getDashboardMetrics() {
        return dashboardServiceImpl.getDashboardMetrics();
    }
}
