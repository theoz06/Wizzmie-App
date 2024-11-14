package com.wizzmie.server_app.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wizzmie.server_app.Entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer>{
    
    Optional<Category> findByDescription(String description);
}
