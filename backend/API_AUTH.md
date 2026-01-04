# MonCVPro Auth API Documentation

This document outlines the Authentication API endpoints for the MonCVPro project.

## Base URL
`/api/auth`

## Endpoints

### 1. Register
`POST /register`
- **Payload:** `{ "email": "user@example.com", "password": "password123", "firstName": "John", "lastName": "Doe" }`
- **Response:** `201 Created` on success.

### 2. Login
`POST /login`
- **Payload:** `{ "email": "user@example.com", "password": "password123" }`
- **Response:**
    - `200 OK`
    - **Body:** `{ "accessToken": "...", "user": { "id": "...", "email": "..." } }`
    - **Cookie:** Sets `refreshToken` as an `HttpOnly` cookie.

### 3. Refresh Token
`POST /refresh`
- **Requirements:** Valid `refreshToken` cookie.
- **Path Restricted:** Cookie is only sent to `/api/auth/refresh`.
- **Response:** `200 OK` with a new `{ "accessToken": "..." }`.

### 4. Logout
`POST /logout`
- **Response:** `200 OK`, clears the `refreshToken` cookie and revokes the session in DB.

### 5. Email Verification
`POST /send-verification-email` (Public)
- **Payload:** `{ "email": "user@example.com" }`
- **Usage:** Re-sends the verification link.

`POST /verify-email`
- **Payload:** `{ "token": "..." }`
- **Effect:** Sets `emailVerified: true` for the user.

### 6. Password Reset
`POST /request-password-reset`
- **Payload:** `{ "email": "user@example.com" }`

`POST /reset-password`
- **Payload:** `{ "token": "...", "newPassword": "newpassword123" }`
- **Effect:** Updates password and revokes all active sessions.

### 7. Current User
`GET /me` (Protected)
- **Requirements:** `Authorization: Bearer <accessToken>`
- **Response:** Profile data of the logged-in user.

## Security Considerations
- **AccessToken:** Short-lived (15m), kept in memory/Zustand on Frontend.
- **RefreshToken:** Long-lived (7d), stored in `HttpOnly`, `SameSite=Strict`, `Secure` (Production) cookie.
- **CORS:** Ensure `credentials: true` is set on the Frontend client (Axios).
