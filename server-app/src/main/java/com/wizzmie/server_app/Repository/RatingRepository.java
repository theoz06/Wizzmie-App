package com.wizzmie.server_app.Repository;

import com.wizzmie.server_app.Entity.Menu;
import com.wizzmie.server_app.Entity.Rating;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RatingRepository extends JpaRepository<Rating, Integer> {
    Optional<Rating> findByCustomerIdAndMenu(Integer customerId, Menu menu);
    List<Rating> findByCustomerId(Integer customerId);
    Collection<String> findByMenuId(Integer id);
    List<Rating> findRatingByMenuId(Integer menuId);
}
