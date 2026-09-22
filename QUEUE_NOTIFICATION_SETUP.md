# Queue Notification Feature Setup

## Replace/add the included files

Copy every file from this package into the same path in your project.

## Install new backend dependencies

```powershell
npm install --prefix backend
```

## Configure Redis

Create a free Redis database using Upstash or Redis Cloud. Copy its TLS connection URL and add it to `backend/.env`:

```env
REDIS_URL=rediss://default:YOUR_PASSWORD@YOUR_REDIS_HOST:6379
```

Never commit this value to GitHub.

## Run

```powershell
npm run dev
```

Expected backend log:

```text
MongoDB connected: ...
API running on http://localhost:5000
```

## Test

1. Log in as recruiter and update a candidate application status.
2. Log in as that candidate.
3. Within 15 seconds, the notification bell displays an unread count.
4. Open the bell and click the notification.
5. Use **Mark all read** to clear unread notifications.

If `REDIS_URL` is missing, the rest of the application keeps working and the backend logs that queue notifications are disabled.
