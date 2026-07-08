package com.floodalert.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostResponse {

    private Long id;
    private String imagePath;
    private String message;
    private LocalDateTime createdAt;
    private long likeCount;
    private List<CommentResponse> comments;
}
