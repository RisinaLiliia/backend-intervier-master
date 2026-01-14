# Backend API

Production-ready REST API built with Node.js, Express, and MongoDB, focused on security, session management, and clean architecture (JWT, refresh sessions, CSRF, HttpOnly cookies).

## Goals

- Secure authentication without exposing tokens to client-side JavaScript
- Predictable session lifecycle
- Clear separation of concerns
- Production-ready security defaults

---

## Tech Stack

- **Node.js**
- **Express**
- **MongoDB + Mongoose**
- **JWT (access + refresh tokens)**
- **CSRF protection**
- **Cookie-based authentication**
- **Rate limiting**
- **ES Modules**

---

## Architecture Overview

- **Authentication**: Access tokens (15 min) + refresh sessions (7 days)
- **Sessions**: Stored in MongoDB with device metadata
- **CSRF**: Per-session CSRF tokens with hashing
- **Security**:
  - HTTP-only cookies
  - Token hashing
  - CSRF middleware
  - Rate limiting on auth endpoints
- **Clean layering**: routes → controllers → services → models

---

## Project Structure

```text
src/
 ├─ app.js
 ├─ server.js
 ├─ config/
 ├─ routes/
 ├─ controllers/
 ├─ services/
 ├─ models/
 ├─ middleware/
 └─ utils/
``` 
---

## Environment Variables

Create a `.env` file:

```env
NODE_ENV=development
PORT=3000

MONGODB_USER=your_user
MONGODB_PASSWORD=your_password
MONGODB_URL=cluster.mongodb.net
MONGODB_DB=your_db

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

CORS_ORIGIN=http://localhost:4200
```  

---

## Authentication Flow

1. User logs in or registers
2. Backend creates a refresh session in MongoDB
3. Cookies are set:
   - accessToken (httpOnly, 15 minutes)
   - refreshToken (httpOnly, 7 days)
   - csrfToken
4. When access token expires, it is refreshed automatically
5. CSRF token is required for all state-changing requests (POST, PUT, PATCH, DELETE)

---

## API Endpoints

### Auth

POST /api/auth/register  
POST /api/auth/login  
POST /api/auth/refresh  
POST /api/auth/logout  
POST /api/auth/logout-all  
GET  /api/auth/me  
GET  /api/auth/csrf  

---

### Categories

GET  /api/categories  
POST /api/categories (auth required)

---

### Questions & Answers

GET    /api/questions  
POST   /api/questions/:questionId (auth + csrf)  
DELETE /api/questions/:questionId (auth + csrf)

---

### Sessions

GET    /api/sessions  
DELETE /api/sessions/:id  

---

## Security

- Refresh tokens are hashed before storing in the database
- CSRF tokens are hashed per session
- Access tokens are stored only in HttpOnly cookies
- Session expiration and revocation supported
- Rate limiting applied to authentication endpoints

---

## Error Handling

- Centralized error middleware
- Consistent JSON error responses
- Proper HTTP status codes

---

## Non-goals

- OAuth / social login (out of scope)
- Role-based access control
- GraphQL API

---

## License

MIT
