package com.wizzmie.server_app.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wizzmie.server_app.Entity.Menu;

public interface MenuRepository extends JpaRepository<Menu, Integer>{

    Optional<Menu> findByName(String name);
    
}
