package com.wizzmie.server_app.Repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.wizzmie.server_app.Entity.OrderHistory;

public interface OrderHistoryRepository extends JpaRepository<OrderHistory, Integer> {
    
}
