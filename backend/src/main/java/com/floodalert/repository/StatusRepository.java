package com.floodalert.repository;

import com.floodalert.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StatusRepository extends JpaRepository<Status, Long> {

    /**
     * Only one status row is maintained; fetch the most recently updated one.
     */
    Optional<Status> findTopByOrderByUpdatedAtDesc();
}
