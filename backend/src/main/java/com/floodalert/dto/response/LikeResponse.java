package com.floodalert.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LikeResponse {

    private Long postId;
    private long likeCount;
    private boolean likedByClient;
}
