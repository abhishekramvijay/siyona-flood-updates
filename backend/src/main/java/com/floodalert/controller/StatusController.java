package com.floodalert.controller;

import com.floodalert.dto.response.StatusResponse;
import com.floodalert.service.StatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Public endpoint exposing the current society-wide flood status.
 */
@RestController
@RequestMapping("/api/status")
@RequiredArgsConstructor
public class StatusController {

    private final StatusService statusService;

    @GetMapping
    public ResponseEntity<StatusResponse> getStatus() {
        return ResponseEntity.ok(statusService.getCurrentStatus());
    }
}
