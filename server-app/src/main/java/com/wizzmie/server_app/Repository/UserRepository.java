package com.wizzmie.server_app.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.wizzmie.server_app.Entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    @Query("SELECT u FROM user u WHERE u.nik = ?1")
    Optional<User> findByNik(String nik);
    
}
