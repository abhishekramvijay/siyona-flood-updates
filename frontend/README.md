# Flood Alert Frontend

Mobile-first React frontend for emergency flood updates in a residential society. Talks to the [Flood Alert Spring Boot backend](../flood-alert-backend).

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Axios (with a session-cookie-aware interceptor)
- React Router

## Project Structure

```
flood-alert-frontend/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── src/
│   ├── main.jsx                    # app entry, providers, router
│   ├── App.jsx                     # route definitions
│   ├── index.css                   # Tailwind entrypoint
│   ├── api/
│   │   ├── axiosClient.js          # baseURL from VITE_API_BASE_URL, withCredentials, 401 handling
│   │   ├── postsApi.js             # GET posts, like, comment
│   │   ├── statusApi.js            # GET status
│   │   └── adminApi.js             # login/logout, create/delete post, update status
│   ├── context/
│   │   └── AdminAuthContext.jsx    # session-based admin auth state
│   ├── routes/
│   │   └── ProtectedRoute.jsx      # guards /admin/dashboard
│   ├── hooks/
│   │   ├── usePosts.js             # posts state + like/comment actions
│   │   ├── useStatus.js            # status state
│   │   └── usePolling.js           # 30s auto-refresh helper
│   ├── utils/
│   │   ├── clientId.js             # per-browser UUID + liked-post tracking (localStorage)
│   │   ├── formatDate.js
│   │   ├── imageUrl.js             # resolves relative image paths against the backend origin
│   │   ├── apiError.js             # friendly error message extraction
│   │   └── authEvents.js           # pub/sub used by the 401 interceptor
│   ├── components/
│   │   ├── layout/                 # Header, Container
│   │   ├── status/                 # StatusCard
│   │   ├── posts/                  # PostList, PostCard, LikeButton, CommentList, CommentForm
│   │   ├── common/                 # Spinner, ErrorMessage, EmptyState
│   │   └── admin/                  # LoginForm, CreatePostForm, StatusForm, PostAdminList
│   └── pages/
│       ├── HomePage.jsx
│       ├── AdminLoginPage.jsx
│       └── AdminDashboardPage.jsx
```

## Setup

### Prerequisites

- Node.js 18+
- The backend running and reachable (see `../flood-alert-backend`)

### Install & configure

```bash
cd flood-alert-frontend
npm install
cp .env.example .env
```

Edit `.env` and point it at your backend:

```
VITE_API_BASE_URL=http://localhost:8080
```

`VITE_API_BASE_URL` is never hardcoded in source — every request goes through `src/api/axiosClient.js`, which reads it at build/runtime via `import.meta.env.VITE_API_BASE_URL`.

### Run (dev)

```bash
npm run dev
```

Opens on `http://localhost:5173` (matches the backend's CORS allow-list).

### Build for production

```bash
npm run build
npm run preview   # serve the production build locally
```

## How It Works

### Public timeline (`/`)

- Fetches `/api/status` and `/api/posts` on load, and again every 30 seconds via `usePolling` (paused while the tab is hidden).
- Each post shows its image, message, relative timestamp, like button + count, and a collapsible comment section.
- **Likes:** a UUID is generated once via `crypto.randomUUID()` and persisted to `localStorage` as the `clientId`. Liked post IDs are also cached locally so the Like button is disabled immediately, even before the next server refresh, enforcing "one like per browser." A `409 Conflict` from the backend (e.g. same browser liking from two tabs) is treated as "already liked" rather than an error.
- **Comments:** name is optional; if left blank, the backend stores `null` and the UI displays "Anonymous."

### Admin (`/admin`, `/admin/dashboard`)

- `/admin` renders the login form. On success, `POST /api/admin/login` establishes a session cookie (the Axios client sets `withCredentials: true` on every request so the cookie is sent/received correctly).
- Auth state is optimistic: a flag is kept in `sessionStorage` after login and cleared on logout. If any admin request comes back `401` (e.g. the session expired server-side), a global interceptor clears that flag and `ProtectedRoute` redirects back to `/admin`.
- `/admin/dashboard` (protected) lets the admin:
  - Publish a new post (image + message, sent as `multipart/form-data`).
  - Update the current status (water level, pump, electricity, lift).
  - Delete existing posts, with a confirmation prompt.

## Notes

- No animations beyond a lightweight loading spinner, per the "no unnecessary animations" requirement.
- Loading and error states are handled explicitly on every data-fetching screen, each with a retry action where relevant.
- The UI is built mobile-first (single-column, max-width container) and scales cleanly to larger screens.
