# Backend Developer Internship Assignment – Complete Solution

This repository contains a **production-style backend-focused system** with a supporting frontend UI:

- ✅ JWT Authentication (Register/Login/Me)
- ✅ Role-Based Access Control (user/admin)
- ✅ Task CRUD APIs (with pagination/filtering)
- ✅ API versioning (`/api/v1`)
- ✅ Validation, central error handling, security middleware
- ✅ Swagger docs + Postman collection
- ✅ MongoDB schema design
- ✅ React frontend to interact with APIs
- ✅ Scalability and architecture documentation

---

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcrypt password hashing
- Zod validation
- Helmet, CORS, rate limiting, Morgan
- Swagger OpenAPI

### Frontend
- React + Vite
- Axios
- React Router

---

## Project Structure

```bash
.
├── backend/
│   ├── docs/openapi.yaml
│   ├── src/
│   │   ├── config/
│   │   ├── middlewares/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── task/
│   │   │   └── user/
│   │   ├── scripts/seedAdmin.js
│   │   ├── app.js
│   │   └── server.js
│   └── .env.example
├── frontend/
│   └── src/
├── docs/
│   ├── architecture.md
│   └── scalability-note.md
├── docker-compose.yml
└── postman_collection.json
```

---

## Setup Instructions

## 1) Start MongoDB (Docker)

```bash
docker compose up -d
```

## 2) Backend setup

```bash
cd backend
cp .env.example .env
npm install
npm run seed-admin
npm run dev
```

Backend runs at: `http://localhost:5000`

Swagger docs: `http://localhost:5000/docs`

## 3) Frontend setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## API Summary

### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me` (protected)

### Tasks (User)
- `GET /api/v1/tasks`
- `POST /api/v1/tasks`
- `GET /api/v1/tasks/:taskId`
- `PATCH /api/v1/tasks/:taskId`
- `DELETE /api/v1/tasks/:taskId`

### Tasks (Admin)
- `GET /api/v1/tasks/admin/all` (admin only)

---

## Security Highlights

- Password hashing using `bcryptjs` (12 rounds)
- JWT signed token auth with expiry
- RBAC middleware by role
- Input validation via Zod schemas
- Helmet for secure headers
- API rate limiting
- Consistent error response format

---

## Frontend Features

- Register/Login forms with response messaging
- Protected dashboard route
- Create/Edit/Delete tasks
- Filter tasks by status and priority
- Live task progress metrics

---

## Documentation Included

- Swagger UI (`/docs`)
- Postman collection (`postman_collection.json`)
- Architecture diagram (`docs/architecture.md`)
- Scalability note (`docs/scalability-note.md`)

---

## Suggested Improvements (Optional for further upgrades)

- Redis caching for heavy list endpoints
- Queue + worker for async jobs
- Refresh tokens + token revocation strategy
- CI/CD with test + lint gates
- Multi-tenant support and audit logging
