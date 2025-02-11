package com.wizzmie.server_app.Repository;

import com.wizzmie.server_app.Entity.Menu;
import com.wizzmie.server_app.Entity.Rating;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RatingRepository extends JpaRepository<Rating, Integer> {
    Optional<Rating> findByCustomerIdAndMenu(Integer customerId, Menu menu);

    @Query(value = "SELECT * FROM ratings WHERE customer_id = :customerId", nativeQuery = true)
    List<Rating> findByCustomerId(@Param("customerId") Integer customerId);
    // List<Rating> findByCustomerId(Integer customerId);
    Collection<String> findByMenuId(Integer id);
    List<Rating> findRatingByMenuId(Integer menuId);

    @Query(value = "SELECT COUNT(DISTINCT menu_id) FROM ratings", nativeQuery = true)
    long countDistinctMenus();

}
