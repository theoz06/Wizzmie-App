package com.wizzmie.server_app.Repository;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.wizzmie.server_app.Entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    @Transactional
    @Modifying
    @Query("DELETE FROM order_item oi WHERE oi.order.id = ?1")
    void deleteByOrderId(@Param("orderId")Integer orderId);
}
