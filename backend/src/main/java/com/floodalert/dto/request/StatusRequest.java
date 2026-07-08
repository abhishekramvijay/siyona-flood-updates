package com.floodalert.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusRequest {

    @NotBlank(message = "waterLevel is required")
    private String waterLevel;

    @NotBlank(message = "pumpStatus is required")
    private String pumpStatus;

    @NotBlank(message = "electricityStatus is required")
    private String electricityStatus;

    @NotBlank(message = "liftStatus is required")
    private String liftStatus;
}
