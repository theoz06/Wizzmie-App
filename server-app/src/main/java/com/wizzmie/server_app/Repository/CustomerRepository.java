package com.wizzmie.server_app.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.wizzmie.server_app.Entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    @Query("SELECT c FROM customer c WHERE c.phone = ?1")
    Optional<Customer> findByPhone(String phone);

}
