package com.wizzmie.server_app.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.math.BigInteger;



import com.wizzmie.server_app.Entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer>{
    
    Optional<Category> findByDescription(String description);

    @Query(value = "SELECT CASE WHEN EXISTS (SELECT 1 FROM category WHERE description = ?1 AND id != ?2) THEN 1 ELSE 0 END", nativeQuery=true)
    BigInteger existByDescriptionAndIdNot(String description, Integer id);
}
