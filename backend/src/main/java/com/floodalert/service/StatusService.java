package com.floodalert.service;

import com.floodalert.dto.request.StatusRequest;
import com.floodalert.dto.response.StatusResponse;
import com.floodalert.entity.Status;
import com.floodalert.repository.StatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StatusService {

    private final StatusRepository statusRepository;

    @Transactional(readOnly = true)
    public StatusResponse getCurrentStatus() {
        Status status = statusRepository.findTopByOrderByUpdatedAtDesc()
                .orElseGet(this::defaultStatus);
        return toResponse(status);
    }

    /**
     * Upserts the single society-wide status row. There is intentionally
     * only ever one authoritative status record.
     */
    @Transactional
    public StatusResponse updateStatus(StatusRequest request) {
        Status status = statusRepository.findTopByOrderByUpdatedAtDesc()
                .orElseGet(Status::new);

        status.setWaterLevel(request.getWaterLevel());
        status.setPumpStatus(request.getPumpStatus());
        status.setElectricityStatus(request.getElectricityStatus());
        status.setLiftStatus(request.getLiftStatus());

        Status saved = statusRepository.save(status);
        return toResponse(saved);
    }

    private Status defaultStatus() {
        return Status.builder()
                .waterLevel("UNKNOWN")
                .pumpStatus("UNKNOWN")
                .electricityStatus("UNKNOWN")
                .liftStatus("UNKNOWN")
                .build();
    }

    private StatusResponse toResponse(Status status) {
        return StatusResponse.builder()
                .id(status.getId())
                .waterLevel(status.getWaterLevel())
                .pumpStatus(status.getPumpStatus())
                .electricityStatus(status.getElectricityStatus())
                .liftStatus(status.getLiftStatus())
                .updatedAt(status.getUpdatedAt())
                .build();
    }
}
