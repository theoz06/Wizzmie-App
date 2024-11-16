package com.wizzmie.server_app.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.wizzmie.server_app.Entity.Menu;

public interface MenuRepository extends JpaRepository<Menu, Integer>{
    @Query("SELECT m FROM menu m WHERE m.name = ?1")
    Optional<Menu> findByName(String name);
    
}
