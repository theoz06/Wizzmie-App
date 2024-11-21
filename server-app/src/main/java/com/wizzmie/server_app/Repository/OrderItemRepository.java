package com.wizzmie.server_app.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wizzmie.server_app.Entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    
}
