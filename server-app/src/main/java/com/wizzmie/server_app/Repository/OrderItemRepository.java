package com.wizzmie.server_app.Repository;

import java.util.Collection;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.wizzmie.server_app.Entity.Menu;
import com.wizzmie.server_app.Entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    @Transactional
    @Modifying
    @Query("DELETE FROM order_item oi WHERE oi.order.id = ?1")
    void deleteByOrderId(@Param("orderId")Integer orderId);

    @Query("SELECT oi FROM order_item oi WHERE oi.order.customer.id = :customerId")
    List<OrderItem> findByCustomerId(@Param("customerId") Integer customerId);

    @Query("SELECT COUNT(oi) > 0 FROM order_item oi WHERE oi.order.customer.id = :customerId")
    boolean existsByCustomerId(@Param("customerId") Integer customerId);

    @Query("SELECT COUNT(oi) FROM order_item oi WHERE oi.menu = :menu")
    Long countByMenu(@Param("menu") Menu menu);

}
