package com.floodalert.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatusResponse {

    private Long id;
    private String waterLevel;
    private String domesticWater;
    private String pumpStatus;
    private String electricityStatus;
    private String liftStatus;
    private LocalDateTime updatedAt;
}
