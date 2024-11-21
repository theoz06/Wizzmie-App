package com.wizzmie.server_app.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wizzmie.server_app.Entity.Orders;

public interface OrderRepository extends JpaRepository<Orders, Integer> {
    
}
