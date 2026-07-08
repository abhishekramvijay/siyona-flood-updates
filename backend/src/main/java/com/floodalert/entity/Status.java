package com.floodalert.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Represents the single, current society-wide flood status.
 * Only one row is expected to exist (id = 1) and is upserted by the admin.
 */
@Entity
@Table(name = "status")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Status {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "water_level", nullable = false)
    private String waterLevel;

    @Column(name = "pump_status", nullable = false)
    private String pumpStatus;

    @Column(name = "electricity_status", nullable = false)
    private String electricityStatus;

    @Column(name = "lift_status", nullable = false)
    private String liftStatus;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PreUpdate
    @PrePersist
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
