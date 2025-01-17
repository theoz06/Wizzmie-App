package com.wizzmie.server_app.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.wizzmie.server_app.Entity.Menu;

public interface MenuRepository extends JpaRepository<Menu, Integer>{
    @Query("SELECT m FROM Menu m WHERE m.name = ?1")
    Optional<Menu> findByName(String name);

    @Modifying
    @Query(value = "UPDATE menu SET is_available = :isAvailable WHERE id = :id", nativeQuery = true)
    Integer updateMenuAvailablelity(@Param("isAvailable") Boolean isAvailable, @Param("id") Integer id);

}
