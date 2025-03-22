# Authentication Implementation Documentation

## Overview

This document details the authentication implementation for the SB Admin Console, a Next.js 14 application using the App Router. The implementation provides a foundation for secure authentication with placeholder credentials, designed to be easily integrated with a backend API.

## Current Implementation

### 1. File Structure

```
app/
├── (admin)/
│   └── dashboard/
│       └── page.tsx      # Protected admin dashboard with logout functionality
├── login/
│   └── page.tsx         # Login page
components/
├── auth/
│   └── LoginForm.tsx    # Login form component
lib/
├── client-auth.ts       # Client-side auth utilities
├── server-auth.ts       # Server-side auth utilities (prepared for backend)
types/
└── auth.ts             # Authentication type definitions
middleware.ts           # Route protection middleware
```

### 2. Type Definitions (`types/auth.ts`)

```typescript
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  tokens: AuthTokens;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

export interface AuthError {
  message: string;
  code: string;
}
```

### 3. Authentication Flow

#### 3.1 Client-Side Authentication (`lib/client-auth.ts`)

Currently implements:

- Cookie-based token storage
- Mock authentication logic
- User session management
- Logout functionality with cookie clearing

Key features:

```typescript
const AUTH_TOKEN_KEY = 'sb-auth-token'
const USER_KEY = 'sb-user'

// Cookie configuration
{
  expires: 7,        // 7-day persistence
  path: '/',         // Available across all routes
  sameSite: 'strict' // CSRF protection
}

// Logout functionality
function clearAuth() {
  Cookies.remove(AUTH_TOKEN_KEY)
  Cookies.remove(USER_KEY)
}
```

#### 3.2 Route Protection (`middleware.ts`)

Implements:

- Route group protection for admin routes
- Authentication state checking
- Redirect logic for authenticated/unauthenticated users
- Proper handling of Next.js route groups

```typescript
export const config = {
  matcher: [
    "/login",
    "/(admin)/:path*", // Protects all admin routes
  ],
};
```

#### 3.3 Login Form Implementation

- Client-side form handling
- Error state management
- Loading state handling
- Redirect after successful authentication
- Proper URL path handling for route groups

```typescript
// Login redirect handling
window.location.href = "/dashboard"; // Maps to (admin) route group internally
```

#### 3.4 Dashboard Logout Implementation

The dashboard page (`app/(admin)/dashboard/page.tsx`) implements a logout button with the following features:

- Clean logout functionality
- Cookie clearance
- Proper redirection to login page
- Consistent path handling

```typescript
function handleLogout() {
  clearAuth(); // Clear authentication cookies
  window.location.href = "/login"; // Redirect to login page
}
```

### 4. URL Path Handling

The implementation uses Next.js route groups for admin routes:

- Route group `(admin)` is used for file organization
- URLs use clean paths without route group notation
- Internal routing:
  - `/dashboard` → `app/(admin)/dashboard/page.tsx`
  - `/login` → `app/login/page.tsx`

Best practices:

- Never expose route group notation `(admin)` in URLs
- Use clean paths for navigation
- Let Next.js handle internal route mapping

## Backend Integration Preparation

### 1. Server-Side Authentication (`lib/server-auth.ts`)

Prepared for backend integration with:

- Secure cookie handling
- Token management functions
- Server-side authentication checks

```typescript
export function setAuthCookies(tokens: AuthTokens) {
  const cookieStore = cookies();
  cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(tokens), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
}
```

### 2. Integration Steps

1. **API Integration**

   ```typescript
   // Replace mock login with actual API call
   async function login(credentials: LoginCredentials): Promise<AuthResponse> {
     const response = await fetch("/api/auth/login", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(credentials),
     });

     if (!response.ok) {
       throw new Error("Authentication failed");
     }

     return response.json();
   }
   ```

2. **Token Management**

   - Implement refresh token rotation
   - Add token expiration handling
   - Implement secure cookie storage

3. **Error Handling**
   - Add specific error types
   - Implement error boundaries
   - Add retry logic for token refresh

## Security Considerations

1. **Cookie Security**

   - HTTP-only cookies for tokens
   - Secure flag in production
   - Strict same-site policy

2. **CSRF Protection**

   - Token validation
   - Same-site cookie policy
   - Custom headers for API requests

3. **XSS Prevention**
   - Content Security Policy
   - Input sanitization
   - Secure cookie handling

## Next Steps

### 1. Backend Integration

1. **API Endpoints**

   - `/api/auth/login` - Login endpoint
   - `/api/auth/refresh` - Token refresh
   - `/api/auth/logout` - Secure logout

2. **Token Management**

   ```typescript
   interface TokenResponse {
     access_token: string;
     refresh_token: string;
     expires_in: number;
   }
   ```

3. **Error Handling**
   ```typescript
   interface ApiError {
     code: string;
     message: string;
     details?: Record<string, unknown>;
   }
   ```

### 2. Enhanced Security

1. **Implement Rate Limiting**

   ```typescript
   // Example rate limit configuration
   export const rateLimitConfig = {
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100, // limit each IP to 100 requests per windowMs
   };
   ```

2. **Add 2FA Support**
   - Prepare UI components
   - Add verification flow
   - Implement backup codes

### 3. User Management

1. **Role-Based Access Control**

   ```typescript
   enum UserRole {
     ADMIN = "admin",
     MANAGER = "manager",
     STAFF = "staff",
   }
   ```

2. **Permission System**
   ```typescript
   interface Permission {
     resource: string;
     actions: string[];
   }
   ```

### 4. Session Management Enhancements

Future improvements for session handling:

1. **Session Timeout**

   - Implement idle timeout detection
   - Add session expiration warnings
   - Auto-logout after inactivity

2. **Multi-Tab Support**

   - Synchronize logout across tabs
   - Handle concurrent sessions

3. **Enhanced Logout Flow**
   - Add logout confirmation
   - Clear client-side state
   - Revoke server-side sessions

## Testing Strategy

1. **Unit Tests**

   - Auth utilities
   - Form validation
   - Token management

2. **Integration Tests**

   - Login flow
   - Token refresh
   - Protected routes

3. **E2E Tests**
   - Complete auth flow
   - Session management
   - Error scenarios

## Alignment with Project Phases

This authentication implementation aligns with the project phases outlined in `project-description.md`:

1. **Phase 1 & 2**: Core setup and dashboard implementation

   - ✅ Basic auth structure
   - ✅ Protected routes
   - ✅ Dashboard access control

2. **Phase 3**: SB Management CRUD

   - 🔄 Role-based access control
   - 🔄 Staff management integration
   - 🔄 Permission system

3. **Future Phases**
   - 📅 Enhanced security features
   - 📅 User management
   - 📅 Audit logging

## Conclusion

The current implementation provides a solid foundation for authentication while maintaining flexibility for backend integration. The system is designed with security best practices and follows Next.js 14 conventions for routing and middleware.

For junior engineers implementing additional features:

1. Follow the established patterns for component structure
2. Maintain type safety with TypeScript
3. Use the prepared auth utilities for new protected routes
4. Consider security implications when adding features

Remember to update this documentation as new features are implemented or when the backend integration begins.
