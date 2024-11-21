package com.wizzmie.server_app.Repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.wizzmie.server_app.Entity.Status;



public interface StatusRepository extends JpaRepository<Status, Integer> {

}
