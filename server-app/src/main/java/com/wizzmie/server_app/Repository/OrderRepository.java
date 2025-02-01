package com.wizzmie.server_app.Repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.wizzmie.server_app.Entity.Orders;

public interface OrderRepository extends JpaRepository<Orders, Integer> {

    @Query(value ="SELECT DISTINCT o.* FROM orders o "+
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

    @Query(value = "SELECT SUM(o.total_amount) FROM orders o WHERE MONTH(o.order_date) = :month AND YEAR(o.order_date) = :year AND o.paid = :paid)", nativeQuery = true)
    BigDecimal getTotalSalesByMonthAndYear(int month, int year, boolean paid);

    @Query(value = "SELECT COUNT(DISTINCT o.customer_id) FROM orders o WHERE MONTH(o.order_date) = :month AND YEAR(o.order_date) = :year AND o.paid = :paid)", nativeQuery = true)
    Long getTotalCustomersByMonthAndYear(int month, int year, boolean paid);

    @Query(value = "SELECT SUM(o.total_amount) FROM orders o WHERE YEAR(o.order_date) = :year AND o.paid = :paid)", nativeQuery = true)
    BigDecimal getTotalSalesByYear(int year, boolean paid);
    
}
