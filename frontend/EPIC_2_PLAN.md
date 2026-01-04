# EPIC 2: Frontend Auth Integration Plan

## Objective
Integrate the frontend with the backend authentication system using Zustand for state management and Axios for API requests.

## Architecture
- **State Management**: Zustand (`src/stores/authStore.ts`)
  - Stores `accessToken` (in-memory) and `user` profile.
  - initializing state logic.
- **API Client**: Axios (`src/lib/axios.ts`)
  - `baseURL`: `process.env.NEXT_PUBLIC_API_URL`
  - `withCredentials: true` (for Cookies).
  - **Interceptors**: 
    - Request: Attach Bearer token.
    - Response: Handle 401 -> Refresh Token -> Retry.
- **Authentication Flow**:
  1.  **Initial Load**: App checks for valid session (calls `/me` or `/refresh`).
  2.  **Login**: `POST /login` -> sets Cookie (Refresh) + returns AccessToken. Update Store.
  3.  **Logout**: `POST /logout` -> Clears Cookie + Clears Store -> Redirects.
  4.  **Refresh**: Silent refresh on 401.

## Steps

### STEP 1: Foundation (Current)
- [x] Install Dependencies (`zustand`, `axios`).
- [x] Create Types (`src/types/auth.ts`).
- [x] Setup Axios Client (`src/lib/axios.ts`).
- [x] Create Auth Store (`src/stores/authStore.ts`).


### STEP 2: Auth Pages
- [ ] `/auth/login` page.
- [ ] `/auth/register` page.
- [ ] `/auth/verify-email` page.
- [ ] `/auth/reset-password` page.

### STEP 3: Protection & Routing
- [ ] Middleware for redirects (`middleware.ts`).
- [ ] `useAuth` hook (wrapped around store).

### STEP 4: Testing & Verification
- [ ] Verify Login flow.
- [ ] Verify Silent Refresh.
- [ ] Verify Logout.
