package com.floodalert.controller;

import com.floodalert.dto.request.StatusRequest;
import com.floodalert.dto.response.StatusResponse;
import com.floodalert.service.StatusService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Admin-only endpoint for updating the society-wide flood status.
 * Protected by session-based Spring Security authentication.
 */
@RestController
@RequestMapping("/api/admin/status")
@RequiredArgsConstructor
public class AdminStatusController {

    private final StatusService statusService;

    @PutMapping
    public ResponseEntity<StatusResponse> updateStatus(@Valid @RequestBody StatusRequest request) {
        return ResponseEntity.ok(statusService.updateStatus(request));
    }
}
