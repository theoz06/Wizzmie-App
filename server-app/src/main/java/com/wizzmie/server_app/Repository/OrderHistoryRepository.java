package com.wizzmie.server_app.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.wizzmie.server_app.DTO.Respon.OrderHistoryResponse;
import com.wizzmie.server_app.Entity.OrderHistory;

public interface OrderHistoryRepository extends JpaRepository<OrderHistory, Integer> {
    
}
