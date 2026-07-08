package com.floodalert.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentRequest {

    @Size(max = 100, message = "name must be at most 100 characters")
    private String name;

    @NotBlank(message = "comment is required")
    @Size(max = 300, message = "comment must be at most 300 characters")
    private String comment;
}
