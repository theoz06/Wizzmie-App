package com.wizzmie.server_app.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wizzmie.server_app.Entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    
}
