package com.wizzmie.server_app.Repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    @Query(value = "SELECT SUM(o.total_amount) FROM orders o WHERE MONTH(o.order_date) = :month AND YEAR(o.order_date) = :year AND o.paid = true", nativeQuery = true)
    BigDecimal getTotalSalesByMonthAndYear(int month, int year);

    @Query(value = "SELECT COUNT(DISTINCT o.customer_id) FROM orders o WHERE MONTH(o.order_date) = :month AND YEAR(o.order_date) = :year AND o.paid = true", nativeQuery = true)
    Long getTotalCustomersByMonthAndYear(int month, int year);

    @Query(value = "SELECT SUM(o.total_amount) FROM orders o WHERE YEAR(o.order_date) = :year AND o.paid = true", nativeQuery = true)
    BigDecimal getTotalSalesByYear(int year);

    @Query("SELECT o FROM orders o JOIN o.orderItems oi WHERE oi.menu.id = :menuId ORDER BY o.orderDate DESC")
    List<Orders> findByMenuIdOrderByOrderDateDesc(@Param("menuId") Integer menuId);

    @Query(value = "SELECT COUNT(o) FROM orders o WHERE o.customer_id = :customerId AND o.paid = true", nativeQuery = true)
    long countByCustomerId(Integer customerId);
    
}
