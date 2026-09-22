# FreshStart Jobs

FreshStart is a portfolio-ready MERN job portal focused on fresher and early-career hiring. Candidates can build profiles, discover and save relevant jobs, apply, and track application progress. Recruiters can publish openings, manage their listings, review applicants, and update hiring statuses.

## Features

- Candidate and recruiter registration with role-based authorization
- JWT authentication persistence and bcrypt password hashing
- Candidate profiles with skills, portfolio, GitHub, and bio
- Job search, location/work-mode/type filters, sorting-ready API, and pagination
- Saved jobs and one-click removal
- Applications with resume links, cover notes, and status tracking
- Recruiter job CRUD with destructive-action confirmation
- Applicant pipeline: applied, reviewing, shortlisted, rejected, hired
- Responsive landing page, dashboards, loading/empty/error states, and 404 page
- Frontend and backend validation plus centralized API error handling
- Realistic seed data and API integration tests

## Tech stack

React 19, Vite, React Router, Axios, modern CSS, Node.js, Express 5, MongoDB, Mongoose, JWT, bcrypt, express-validator, Node test runner, Supertest, and mongodb-memory-server.

## Architecture

The React single-page application calls a REST API through a centralized Axios client. Express routes apply validation, authentication, and role middleware before controllers access Mongoose models. MongoDB stores users, jobs, saved-job relationships, and applications. Password hashes and environment secrets remain server-side.

## Folder structure

```text
freshstart-jobs/
├── backend/
│   ├── config/ controllers/ middleware/ models/ routes/ scripts/ tests/ utils/
│   ├── app.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/ context/ pages/ services/
│       ├── App.jsx
│       └── styles.css
└── README.md
```

## Installation

Requirements: Node.js 20+ and MongoDB 7+ (local MongoDB or MongoDB Atlas).

```bash
cd freshstart-jobs
npm install
npm run install:all
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Set `MONGODB_URI` and a long random `JWT_SECRET` in `backend/.env`. Never commit the `.env` files.

## Run locally

```bash
# Optional: load realistic demo data
npm run seed --prefix backend

# Run frontend and backend together
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5000/api
- Demo accounts after seeding:
  - Candidate: `candidate@freshstart.dev` / `Demo@123`
  - Recruiter: `recruiter@freshstart.dev` / `Demo@123`

## Build and test

```bash
npm run build
npm test
# Full MongoDB-backed API flow suite
npm run test:integration --prefix backend
```

The integration test database runs in memory and does not modify development data.

## API overview

| Area | Endpoints |
| --- | --- |
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Profile | `PUT /api/users/profile` |
| Jobs | `GET/POST /api/jobs`, `GET/PUT/DELETE /api/jobs/:id`, `GET /api/jobs/mine` |
| Saved jobs | `POST /api/jobs/:id/save`, `GET /api/jobs/saved` |
| Applications | `POST /api/applications/:jobId`, `GET /api/applications/mine` |
| Recruiting | `GET /api/applications/job/:jobId`, `PATCH /api/applications/:id/status` |

## Screenshots

- Landing page — add `docs/screenshots/home.png`
- Job search — add `docs/screenshots/jobs.png`
- Candidate dashboard — add `docs/screenshots/candidate-dashboard.png`
- Recruiter pipeline — add `docs/screenshots/recruiter-applicants.png`

## Future improvements

- Cloudinary/S3 resume and logo uploads
- Email verification, forgot-password flow, and refresh-token rotation
- Recruiter/company verification and job moderation
- Email notifications and interview scheduling
- Advanced skill matching and job recommendations
- Deployment pipeline, monitoring, and rate limiting
