package com.wizzmie.server_app.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ch.qos.logback.core.status.Status;

public interface StatusRepository extends JpaRepository<Status, Integer> {}
