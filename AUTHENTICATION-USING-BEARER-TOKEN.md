# Authentication Using Bearer Token

## Overview

This document describes the implementation of Bearer Token authentication in the Like Telecom Frontend application. The system uses JWT-style Bearer tokens for user authentication, with automatic session management including a 2-hour expiration period and automatic logout.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Implementation Details](#implementation-details)
3. [File Structure](#file-structure)
4. [API Endpoints](#api-endpoints)
5. [Token Management](#token-management)
6. [Session Management](#session-management)
7. [Usage Examples](#usage-examples)
8. [Security Considerations](#security-considerations)

---

## Architecture Overview

The authentication system follows a standard Bearer Token pattern:

1. **Client-side**: Bearer tokens are stored in `localStorage` and sent in the `Authorization` header as `Bearer {token}` for all authenticated requests.

2. **Server-side (Next.js API Routes)**: Next.js API routes act as proxies, extracting the Bearer token from incoming requests and forwarding it along with the `System-Key` header to the backend API.

3. **Backend API**: The backend API validates the Bearer token along with the System-Key for authentication and authorization.

### Authentication Flow

```
┌─────────┐         ┌──────────────┐         ┌─────────────┐
│ Client  │────────▶│ Next.js API  │────────▶│ Backend API │
│ (React) │         │   Routes     │         │ (like.test) │
└─────────┘         └──────────────┘         └─────────────┘
     │                     │                         │
     │                     │                         │
     │ Bearer Token        │ Bearer Token +          │
     │ in localStorage     │ System-Key              │ Validates Token
     │                     │                         │
```

---

## Implementation Details

### 1. Token Storage

- **Storage Key**: `like_auth_token`
- **Location**: Browser `localStorage`
- **Format**: Plain string token (e.g., `"29|A8NXPAwUqXNptkKNJUDdD1lMsuLRXUZlaZ06mNUJcec2147c"`)
- **Session Timestamp Key**: `like_auth_token_time` (stores when the token was issued)

### 2. Session Duration

- **Duration**: 2 hours (120 minutes / 7,200,000 milliseconds)
- **Auto-logout**: Automatically logs out users after 2 hours of inactivity
- **Expiration Check**: On app mount, checks if token has expired before using it

### 3. Token Usage

Bearer tokens are used in the following scenarios:

- **User Profile Fetching**: `GET /api/v2/auth/user` with `Authorization: Bearer {token}`
- **User Logout**: `POST /api/v2/auth/logout` with `Authorization: Bearer {token}`
- **All Authenticated API Calls**: Any API route that requires authentication

---

## File Structure

### Core Files

```
like-telecom-frontend/
├── app/
│   ├── context/
│   │   ├── AuthContext.tsx          # Main authentication context provider
│   │   └── authApi.ts                # API functions for auth operations
│   ├── lib/
│   │   └── auth-utils.ts             # Utility functions for token extraction
│   ├── api/
│   │   └── auth/
│   │       ├── login/
│   │       │   └── route.ts          # Login API route
│   │       ├── signup/
│   │       │   └── route.ts          # Signup API route
│   │       ├── info/
│   │       │   └── route.ts          # Get user info API route (GET)
│   │       └── logout/
│   │           └── route.ts          # Logout API route (POST)
│   └── (dashboard)/
│       └── profile/
│           └── page.tsx              # User profile/dashboard page
└── components/
    └── layout/
        └── Navbar.tsx                # Navigation bar with user info
```

### Key Files Explained

#### 1. `app/context/AuthContext.tsx`

The main authentication context provider that manages:
- User state (current logged-in user)
- Access token state
- Loading state
- Login, signup, and logout functions
- Session expiration handling
- Auto-logout timer

**Key Features:**
- Rehydrates user session from `localStorage` on app mount
- Checks token expiration before using stored tokens
- Automatically logs out users after 2 hours
- Fetches full user profile after login/signup

#### 2. `app/context/authApi.ts`

Contains all API functions for authentication:

- `login(payload)`: Authenticates user with phone and password
- `signup(payload)`: Registers a new user
- `fetchProfile(access_token)`: Fetches full user profile using Bearer token
- `logout(access_token)`: Invalidates token on server

**User Interface:**
The `User` interface matches the backend API response structure, including:
- Basic info (id, name, email, phone)
- Authentication fields (access_token, refresh_token, user_type)
- Profile fields (address, city, state, country, postal_code)
- Account fields (balance, banned, is_suspicious, referral_code)
- Timestamps (created_at, updated_at)

#### 3. `app/lib/auth-utils.ts`

Utility function for extracting Bearer tokens from Next.js requests:

```typescript
getBearerToken(request: NextRequest): string | null
```

Extracts the token from `Authorization: Bearer {token}` header.

#### 4. API Routes

All API routes in `app/api/auth/` act as proxies to the backend API:

- **`/api/auth/login`** (POST): Proxies to `POST /api/v2/auth/login`
- **`/api/auth/signup`** (POST): Proxies to `POST /api/v2/auth/signup`
- **`/api/auth/info`** (GET): Proxies to `GET /api/v2/auth/user`
- **`/api/auth/logout`** (POST): Proxies to `POST /api/v2/auth/logout`

All routes:
- Extract Bearer token from `Authorization` header (where applicable)
- Forward `System-Key` header from environment variables
- Forward Bearer token to backend API
- Return backend API response to client

---

## API Endpoints

### Backend API Endpoints

#### 1. Login

**Endpoint**: `POST /api/v2/auth/login`

**Request Body:**
```json
{
  "login_by": "phone",
  "phone": "01712345678",
  "password": "password123"
}
```

**Response:**
```json
{
  "result": true,
  "message": "Successfully logged in",
  "access_token": "29|A8NXPAwUqXNptkKNJUDdD1lMsuLRXUZlaZ06mNUJcec2147c",
  "token_type": "Bearer",
  "expires_at": null,
  "user": {
    "id": 363,
    "type": null,
    "name": "Meherab Test",
    "email": null,
    "avatar": null,
    "avatar_original": "http://like.test/public/assets/img/placeholder.jpg",
    "phone": "01111111111",
    "email_verified": false
  }
}
```

#### 2. Signup/Register

**Endpoint**: `POST /api/v2/auth/signup`

**Request Body:**
```json
{
  "name": "User Name",
  "register_by": "phone",
  "email_or_phone": "01712345678",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response:** Same as Login response

#### 3. Get User Info

**Endpoint**: `GET /api/v2/auth/user`

**Headers:**
```
Authorization: Bearer {token}
System-Key: {system_key}
```

**Response:**
```json
{
  "id": 363,
  "referred_by": null,
  "provider": null,
  "provider_id": null,
  "refresh_token": null,
  "access_token": null,
  "user_type": "customer",
  "name": "Meherab Test",
  "email": null,
  "email_verified_at": null,
  "verification_code": "956322",
  "otp_code": null,
  "otp_sent_time": null,
  "new_email_verificiation_code": null,
  "device_token": null,
  "avatar": null,
  "avatar_original": null,
  "address": null,
  "country": null,
  "state": null,
  "city": null,
  "postal_code": null,
  "phone": "01111111111",
  "balance": 0,
  "banned": 0,
  "is_suspicious": 0,
  "referral_code": null,
  "customer_package_id": null,
  "remaining_uploads": 0,
  "created_at": "2025-12-24T05:29:44.000000Z",
  "updated_at": "2025-12-24T05:29:44.000000Z"
}
```

#### 4. Logout

**Endpoint**: `POST /api/v2/auth/logout`

**Headers:**
```
Authorization: Bearer {token}
System-Key: {system_key}
```

**Response:**
```json
{
  "result": true,
  "message": "Successfully logged out"
}
```

---

## Token Management

### Storing Tokens

When a user logs in or signs up:

1. The `access_token` from the API response is stored in `localStorage` with key `like_auth_token`
2. The current timestamp is stored in `localStorage` with key `like_auth_token_time`
3. The token is stored in the React context state

```typescript
localStorage.setItem("like_auth_token", access_token);
localStorage.setItem("like_auth_token_time", Date.now().toString());
setAccessToken(access_token);
```

### Retrieving Tokens

On app mount:

1. Check if token exists in `localStorage`
2. Check if token timestamp exists
3. Verify token hasn't expired (current time - stored time < 2 hours)
4. If valid, fetch user profile using the token
5. If invalid or expired, clear storage and show login screen

### Clearing Tokens

On logout:

1. Clear token from `localStorage`
2. Clear timestamp from `localStorage`
3. Clear token from React context state
4. Clear user data from React context state
5. Call logout API to invalidate token on server (optional, fails gracefully)

---

## Session Management

### Session Expiration

- **Duration**: 2 hours from the time of login/signup
- **Check**: On every app mount/refresh
- **Action**: If expired, automatically clear tokens and redirect to login

### Auto-Logout Timer

After successful login/signup:

1. Calculate remaining session time: `2 hours - (current time - login time)`
2. Set a timeout to automatically log out when session expires
3. Clear the timeout if user logs out manually before expiration

### Implementation in AuthContext

```typescript
const SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours

// On mount - check expiration
const now = Date.now();
const sessionStart = parseInt(storedTime, 10);
if (now - sessionStart > SESSION_DURATION_MS) {
  // Session expired - auto logout
  // Clear tokens and user data
}

// Set auto-logout timer
const timeRemaining = SESSION_DURATION_MS - (now - sessionStart);
setTimeout(() => {
  logout(); // Auto-logout after 2 hours
}, timeRemaining);
```

---

## Usage Examples

### Using Auth Context in Components

```typescript
import { useAuth } from '@/app/context/AuthContext';

function MyComponent() {
  const { user, accessToken, loading, login, logout } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Phone: {user.phone}</p>
      <p>Email: {user.email || 'Not provided'}</p>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
```

### Making Authenticated API Calls (Client-side)

```typescript
const { accessToken } = useAuth();

// Make authenticated request
const response = await fetch('/api/some-endpoint', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`, // Include Bearer token
  },
});
```

### Creating New API Routes with Bearer Token Support

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getBearerToken } from '@/app/lib/auth-utils';

export async function GET(req: NextRequest) {
  const apiBase = process.env.API_BASE;
  const systemKey = process.env.SYSTEM_KEY;

  // Extract Bearer token from request
  const bearerToken = getBearerToken(req);

  // Make request to backend API
  const res = await fetch(`${apiBase}/some-endpoint`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'System-Key': systemKey,
      ...(bearerToken && { 'Authorization': `Bearer ${bearerToken}` }), // Include if present
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
```

---

## Security Considerations

### 1. Token Storage

- **localStorage vs Cookies**: Using `localStorage` for simplicity, but cookies with `HttpOnly` flag would be more secure
- **XSS Vulnerability**: Tokens in `localStorage` are vulnerable to XSS attacks. Ensure proper input sanitization and Content Security Policy (CSP) headers

### 2. Token Transmission

- **HTTPS**: Always use HTTPS in production to encrypt token transmission
- **Authorization Header**: Tokens are sent in the `Authorization` header, not in URL parameters or request bodies

### 3. Token Expiration

- **2-Hour Expiration**: Tokens expire after 2 hours to limit exposure if compromised
- **Automatic Cleanup**: Expired tokens are automatically cleared from storage

### 4. Logout

- **Server-Side Invalidation**: Logout API call invalidates the token on the server
- **Local Cleanup**: Even if server logout fails, local tokens are cleared for immediate UI update

### 5. System Key

- **Environment Variables**: System key is stored in environment variables, never in client-side code
- **Server-Side Only**: System key is only added by Next.js API routes, never exposed to client

---

## Environment Variables

Required environment variables:

```env
API_BASE=http://like.test/api/v2
SYSTEM_KEY=your_system_key_here
```

These should be set in `.env.local` for local development and in your production environment.

---

## Troubleshooting

### Token Not Working

1. **Check token format**: Ensure token is sent as `Authorization: Bearer {token}` (with space after "Bearer")
2. **Check expiration**: Verify token hasn't expired (check timestamp in localStorage)
3. **Check backend API**: Verify backend API is accessible and accepts the token format
4. **Check System-Key**: Ensure `SYSTEM_KEY` environment variable is set correctly

### Auto-Logout Issues

1. **Check session duration**: Verify `SESSION_DURATION_MS` is set to 2 hours (7,200,000 ms)
2. **Check localStorage**: Verify `like_auth_token_time` is being saved correctly
3. **Check timer**: Verify auto-logout timer is being set correctly on login

### User Profile Not Loading

1. **Check token**: Verify token is valid and not expired
2. **Check API endpoint**: Verify `/api/v2/auth/user` endpoint is accessible
3. **Check response format**: Verify backend response matches expected User interface structure
4. **Check network**: Verify network requests are successful (check browser DevTools)

---

## Summary of Changes Made

### Files Modified

1. **`app/context/AuthContext.tsx`**
   - Changed session duration from 30 minutes to 2 hours
   - Updated to use Bearer token for user profile fetching
   - Added automatic logout API call on logout
   - Added full user profile fetching after login/signup

2. **`app/context/authApi.ts`**
   - Updated `User` interface to match backend API response structure
   - Changed `fetchProfile` to use GET method with Bearer token in Authorization header
   - Added `logout` function to call logout API endpoint
   - Fixed login API to use `phone` field instead of `email`

3. **`app/api/auth/info/route.ts`**
   - Changed from POST to GET method
   - Updated to extract Bearer token from Authorization header
   - Updated to call `GET /api/v2/auth/user` instead of `POST /api/v2/auth/info`

4. **`app/api/auth/login/route.ts`**
   - Updated to use `phone` field in request body
   - Ensured `login_by: "phone"` is always set

5. **`app/(dashboard)/profile/page.tsx`**
   - Updated to display actual user information from API
   - Added loading and error states
   - Displayed user fields: name, email, phone, address, balance, user_type, etc.

### Files Created

1. **`app/lib/auth-utils.ts`**
   - Created utility function `getBearerToken` for extracting Bearer tokens from Next.js requests

2. **`app/api/auth/logout/route.ts`**
   - Created new API route for logout functionality
   - Calls `POST /api/v2/auth/logout` with Bearer token

3. **`AUTHENTICATION-USING-BEARER-TOKEN.md`**
   - Created comprehensive documentation (this file)

---

## Conclusion

The Bearer Token authentication system is now fully implemented with:

✅ Bearer token storage and management  
✅ 2-hour session expiration  
✅ Automatic logout after expiration  
✅ User profile fetching with Bearer token  
✅ Logout API integration  
✅ User information display in navbar and dashboard  
✅ Comprehensive error handling  
✅ Type-safe TypeScript interfaces  

All authentication flows now use Bearer tokens with proper session management and security considerations.

