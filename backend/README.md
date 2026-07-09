# Flood Alert Backend

Backend service for publishing emergency flood updates in a residential society: photo + message posts, resident likes/comments, and a live utility status board (water level, pump, electricity, lift).

## Tech Stack

- Java 21
- Spring Boot 3.3
- Spring Web
- Spring Security (session-based auth)
- Spring Data JPA
- Bean Validation (Jakarta Validation)
- H2 Database (file-based, embedded)
- Lombok
- Maven

## Project Structure

```
flood-alert-backend/
├── pom.xml
├── uploads/                          # uploaded post images (served at /uploads/**)
├── src/main/java/com/floodalert/
│   ├── FloodAlertApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java       # session auth, CORS, endpoint rules
│   │   └── WebConfig.java            # static resource mapping for /uploads
│   ├── security/
│   │   ├── AdminUserDetailsService.java   # loads the single preconfigured admin
│   │   └── AdminAuthenticationEntryPoint.java  # JSON 401 responses
│   ├── entity/
│   │   ├── Post.java
│   │   ├── Comment.java
│   │   ├── Like.java
│   │   └── Status.java
│   ├── repository/
│   │   ├── PostRepository.java
│   │   ├── CommentRepository.java
│   │   ├── LikeRepository.java
│   │   └── StatusRepository.java
│   ├── dto/
│   │   ├── request/                  # LoginRequest, LikeRequest, CommentRequest, StatusRequest
│   │   └── response/                 # PostResponse, CommentResponse, LikeResponse, StatusResponse, ApiErrorResponse, MessageResponse
│   ├── service/
│   │   ├── PostService.java
│   │   ├── CommentService.java
│   │   ├── LikeService.java
│   │   ├── StatusService.java
│   │   └── FileStorageService.java   # image upload/delete
│   ├── controller/
│   │   ├── PostController.java       # public
│   │   ├── StatusController.java     # public
│   │   ├── AdminAuthController.java  # login/logout
│   │   ├── AdminPostController.java  # create/delete posts
│   │   └── AdminStatusController.java # update status
│   └── exception/
│       ├── GlobalExceptionHandler.java
│       ├── ResourceNotFoundException.java
│       ├── DuplicateLikeException.java
│       └── InvalidFileException.java
└── src/main/resources/
    └── application.properties
```

## Running the Application

### Prerequisites

- Java 21 (JDK)
- Maven 3.9+ (or use the included wrapper if you add one)

### Run

```bash
cd flood-alert-backend
mvn spring-boot:run
```

The API starts on `http://localhost:8080`.

### Build a jar

```bash
mvn clean package
java -jar target/flood-alert-backend.jar
```

### Database

H2 runs in file mode by default, persisting to `./data/floodalert.mv.db` so posts/comments/likes/status survive restarts. The H2 console is available at `http://localhost:8080/h2-console` (JDBC URL `jdbc:h2:file:./data/floodalert`, user `sa`, empty password) for local inspection only — disable it before deploying to production.

### Uploaded images

Images are stored under `./uploads` (created automatically) and served statically at `http://localhost:8080/uploads/<filename>`.

## Admin Credentials

A single admin account is preconfigured in `application.properties`:

- **Username:** `admin`
- **Password:** `Siyona@Flood2026!`

The password is never stored in plaintext — only its BCrypt hash (`app.admin.password-hash`) is kept in configuration. To change the password, generate a new BCrypt hash and replace the value:

```java
new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode("your-new-password");
```

or with Python:

```bash
pip install bcrypt
python3 -c "import bcrypt; print(bcrypt.hashpw(b'your-new-password', bcrypt.gensalt(rounds=10)).decode())"
```

Login is session-based: a successful `POST /api/admin/login` establishes a `JSESSIONID` cookie which must be sent (`credentials: 'include'`) on subsequent admin requests.

## API Reference

### Public

| Method | Path | Description |
|---|---|---|
| GET | `/api/posts` | List all posts, newest first, with `likeCount` and `comments` |
| GET | `/api/status` | Current society flood status |
| POST | `/api/posts/{id}/like` | Like a post. Body: `{ "clientId": "uuid" }`. One like per `(postId, clientId)` |
| POST | `/api/posts/{id}/comments` | Comment on a post. Body: `{ "name": "optional", "comment": "..." }` |

### Admin (requires an authenticated session)

| Method | Path | Description |
|---|---|---|
| POST | `/api/admin/login` | Body: `{ "username": "...", "password": "..." }` |
| POST | `/api/admin/logout` | Invalidates the session |
| POST | `/api/admin/posts` | Multipart form: `image` (file), `message` (text, ≤500 chars) |
| DELETE | `/api/admin/posts/{id}` | Deletes a post, its comments, likes, and stored image |
| PUT | `/api/admin/status` | Body: `{ "waterLevel", "pumpStatus", "electricityStatus", "liftStatus" }` |

### Example requests

```bash
# Login (persist cookies for subsequent admin calls)
curl -c cookies.txt -X POST http://localhost:8080/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'

# Create a post (admin)
curl -b cookies.txt -X POST http://localhost:8080/api/admin/posts \
  -F "image=@flood.jpg" \
  -F "message=Water level rising near Block C"

# Update status (admin)
curl -b cookies.txt -X PUT http://localhost:8080/api/admin/status \
  -H "Content-Type: application/json" \
  -d '{"waterLevel":"HIGH","pumpStatus":"RUNNING","electricityStatus":"AVAILABLE","liftStatus":"OUT_OF_SERVICE"}'

# Public: list posts
curl http://localhost:8080/api/posts

# Public: like a post
curl -X POST http://localhost:8080/api/posts/1/like \
  -H "Content-Type: application/json" \
  -d '{"clientId":"b3b1a6b0-9c9a-4a7b-8b1a-000000000001"}'

# Public: comment on a post
curl -X POST http://localhost:8080/api/posts/1/comments \
  -H "Content-Type: application/json" \
  -d '{"name":"Priya","comment":"Thanks for the update!"}'
```

## Security Notes

- Admin endpoints (`/api/admin/**`) require `ROLE_ADMIN`, enforced by Spring Security; unauthenticated requests get a JSON `401`.
- Passwords are compared using BCrypt (`spring-security-crypto`); the plaintext password is never persisted or logged.
- All database access goes through Spring Data JPA repositories, which use parameterized queries — no string-concatenated SQL, eliminating SQL injection risk.
- All request bodies are validated with Jakarta Bean Validation (`@NotBlank`, `@Size`, etc.); invalid input returns `400` with field-level error messages.
- CORS is restricted to `http://localhost:5173` (the frontend dev origin) with credentials enabled, so the session cookie can be sent cross-origin from the SPA.
- CSRF protection is disabled because the API is a stateless-style JSON service consumed by a separate SPA origin rather than server-rendered forms; the CORS allow-list is the primary defense against cross-origin abuse.
- Uploaded images are validated by content type, renamed to random UUID filenames, and path-checked to prevent directory traversal.

## HTTP Status Codes

| Scenario | Status |
|---|---|
| Successful GET | 200 |
| Resource created (post, like, comment) | 201 |
| Successful update/delete/login | 200 |
| Validation failure | 400 |
| Not authenticated (admin) | 401 |
| Post/resource not found | 404 |
| Duplicate like for same client | 409 |
| Unexpected server error | 500 |

## Configuration

All tunables live in `src/main/resources/application.properties`, including the H2 datasource, upload directory, max upload size, admin credentials, and allowed CORS origin.

Built in July 2026 as an emergency flood update platform for Pethkar Siyona. Includes admin dashboard, photo uploads, live status updates, comments, and likes. Deployed on Railway.