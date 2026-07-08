package com.floodalert.service;

import com.floodalert.exception.InvalidFileException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg", "image/png", "image/gif", "image/webp"
    );

    private final Path uploadRoot;

    public FileStorageService(@Value("${app.upload.dir:uploads}") String uploadDir) {
        this.uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadRoot);
        } catch (IOException e) {
            throw new IllegalStateException("Could not initialize upload directory: " + uploadRoot, e);
        }
    }

    /**
     * Persists an uploaded image to the uploads directory with a randomized,
     * collision-proof filename and returns a web-servable relative path.
     */
    public String storeImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("Image file is required");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new InvalidFileException("Only JPEG, PNG, GIF, or WEBP images are allowed");
        }

        String originalFilename = StringUtils.cleanPath(
                file.getOriginalFilename() == null ? "image" : file.getOriginalFilename());

        if (originalFilename.contains("..")) {
            throw new InvalidFileException("Invalid file name");
        }

        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex >= 0) {
            extension = originalFilename.substring(dotIndex);
        }

        String storedFilename = UUID.randomUUID() + extension;
        Path targetPath = uploadRoot.resolve(storedFilename).normalize();

        if (!targetPath.getParent().equals(uploadRoot)) {
            throw new InvalidFileException("Invalid file path");
        }

        try (InputStream in = file.getInputStream()) {
            Files.copy(in, targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            log.error("Failed to store uploaded file", e);
            throw new InvalidFileException("Failed to store uploaded image");
        }

        return "/uploads/" + storedFilename;
    }

    /**
     * Best-effort deletion of a previously stored image; failures are logged
     * but never propagated, since a missing file should not block the
     * deletion of the owning post.
     */
    public void deleteImage(String imagePath) {
        if (!StringUtils.hasText(imagePath)) {
            return;
        }
        try {
            String filename = Paths.get(imagePath).getFileName().toString();
            Path target = uploadRoot.resolve(filename).normalize();
            if (target.getParent().equals(uploadRoot)) {
                Files.deleteIfExists(target);
            }
        } catch (IOException e) {
            log.warn("Failed to delete image file {}", imagePath, e);
        }
    }
}
