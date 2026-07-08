package com.floodalert.repository;

import com.floodalert.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findAllByPostIdOrderByCreatedAtAsc(Long postId);

    List<Comment> findAllByPostIdInOrderByCreatedAtAsc(List<Long> postIds);

    long countByPostId(Long postId);

    void deleteAllByPostId(Long postId);
}
