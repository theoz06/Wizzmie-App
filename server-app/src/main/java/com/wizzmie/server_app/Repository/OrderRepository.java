package com.wizzmie.server_app.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.wizzmie.server_app.Entity.Orders;

public interface OrderRepository extends JpaRepository<Orders, Integer> {

    @Query(value ="SELECT DISTINCT o.* FROM Orders o "+
           "JOIN order_item oi ON o.id = oi.order_id " +
           "WHERE o.paid = ?1", 
           nativeQuery = true)
    List<Orders> findByStatusPaid(Boolean paid);

    @Query("SELECT DISTINCT o FROM orders o " +
       "LEFT JOIN FETCH o.orderItems oi " +
       "LEFT JOIN FETCH oi.menu " +
       "WHERE o.orderStatus.id = ?1")
    List<Orders> findByOrderStatusId(Integer status_id);

    List<Orders> findByCustomerId(Integer customerId);
    
}
