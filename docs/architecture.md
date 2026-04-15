# Architecture Diagram

```mermaid
flowchart TD
    A[React Frontend\n(Vite)] -->|HTTPS + JWT| B[Express API Gateway\n/api/v1]
    B --> C[Auth Module\nRegister/Login/Me]
    B --> D[Task Module\nCRUD + Pagination]
    B --> E[RBAC + JWT Middleware]
    B --> F[Validation + Error Layer]
    C --> G[(MongoDB)]
    D --> G
    H[Swagger UI / Postman] --> B
```

## Request Lifecycle
1. Frontend sends request with/without JWT.
2. API middleware stack handles security headers, rate limiting, and body parsing.
3. Route-level validation runs using Zod.
4. Auth middleware verifies JWT and attaches user context.
5. Role middleware enforces authorization for admin routes.
6. Controller/service processes business logic and persists data.
7. Global error handler returns standardized JSON error payloads.
