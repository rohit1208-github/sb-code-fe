# API Integration & Authorization Implementation

## Overview

This document details the API integration and authorization implementation for the SB Admin Console, following the architecture outlined in `project-description.md`. The implementation provides a secure, type-safe way to interact with the Django backend API using JWT tokens and proper error handling.

## Current Implementation

### 1. File Structure

```
lib/
├── api.ts                 # Core API client with interceptors
├── api-config.ts          # API configuration and endpoints
├── client-auth.ts         # Auth token management
services/
├── countries.service.ts   # Countries API service
hooks/
├── useCountries.ts        # React Query hook for countries
types/
└── api.ts                # Shared API types
```

### 2. API Client Implementation

#### 2.1 Base Configuration (`lib/api-config.ts`)

```typescript
export const API_CONFIG = {
  BASE_URL: "http://192.168.0.239:8000",
  ENDPOINTS: {
    LOGIN: "/api/token/",
    REFRESH: "/api/token/refresh/",
    COUNTRIES: "/api/management/countries/",
  },
} as const;
```

#### 2.2 Core API Client (`lib/api.ts`)

The API client implements:

- Axios instance with base configuration
- Authorization header injection
- Request/Response interceptors
- Error handling
- Detailed logging

Key features:

```typescript
const ACCESS_TOKEN_KEY = "sb-access-token";

const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Authorization Interceptor
api.interceptors.request.use((config) => {
  const token = Cookies.get(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 3. Authorization Flow

1. **Token Storage**:

   - Access token stored in cookie with key `sb-access-token`
   - HTTP-only cookie for security
   - Strict same-site policy

2. **Request Flow**:

   ```typescript
   // 1. Interceptor checks for token
   const token = Cookies.get(ACCESS_TOKEN_KEY);

   // 2. Adds Authorization header if token exists
   config.headers.Authorization = `Bearer ${token}`;

   // 3. Logs request details (sanitized)
   console.log("🚀 Request:", {
     method: config.method?.toUpperCase(),
     url: `${config.baseURL}${config.url}`,
     headers: {
       Authorization: token ? "Bearer [HIDDEN]" : "None",
     },
   });
   ```

3. **Error Handling**:
   - 401/403 errors for auth issues
   - Network errors
   - Timeout handling
   - Detailed error logging

### 4. Service Layer Implementation

Services follow a consistent pattern:

```typescript
// Example: countries.service.ts
export const CountriesService = {
  getAll: async () => {
    logApiCall("GET", BASE_URL);
    const response = await apiClient.get<Country[]>(BASE_URL);
    console.log("📥 Response:", response.data);
    return response;
  },
  // ... other methods
};
```

### 5. React Query Integration

```typescript
// Example: useCountries.ts
export function useCountries() {
  const {
    data: countries,
    isLoading,
    error,
  } = useQuery<Country[], AxiosError<ApiError>>({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const response = await CountriesService.getAll();
      return response.data;
    },
  });
  // ... mutations and other functionality
}
```

## Development and Debugging

1. **Request Logging**:

   ```typescript
   🔐 Using token: eyJ0eXAiOi...
   🚀 Request: {
     method: 'GET',
     url: 'http://192.168.0.239:8000/api/management/countries',
     headers: { Authorization: 'Bearer [HIDDEN]' }
   }
   ```

2. **Response Logging**:

   ```typescript
   ✅ Response: {
     status: 200,
     data: [{ id: 1, name: 'india', ... }]
   }
   ```

3. **Error Logging**:
   ```typescript
   ❌ Response Error: {
     message: 'Request failed with status code 403',
     status: 403,
     data: { detail: 'Authentication credentials were not provided.' }
   }
   ```

## Next Steps

### 1. Token Refresh Implementation

1. **Refresh Token Flow**:

   ```typescript
   // Add refresh token interceptor
   api.interceptors.response.use(
     (response) => response,
     async (error) => {
       if (error.response?.status === 401) {
         return refreshTokenAndRetry(error);
       }
       return Promise.reject(error);
     }
   );
   ```

2. **Auto Refresh**:
   - Implement token refresh before expiration
   - Handle concurrent requests during refresh
   - Queue requests during refresh

### 2. Service Implementation Pattern

For implementing other API services:

1. **Create Service**:

   ```typescript
   // Template for new services
   export const NewService = {
     getAll: () => apiClient.get<Type[]>(BASE_URL),
     getById: (id: number) => apiClient.get<Type>(`${BASE_URL}/${id}`),
     create: (data: CreateDto) => apiClient.post<Type>(BASE_URL, data),
     update: (id: number, data: UpdateDto) =>
       apiClient.patch<Type>(`${BASE_URL}/${id}`, data),
     delete: (id: number) => apiClient.delete(`${BASE_URL}/${id}`),
   };
   ```

2. **Create Hook**:
   ```typescript
   // Template for React Query hooks
   export function useNewResource() {
     return useQuery({
       queryKey: ["key"],
       queryFn: async () => {
         const response = await NewService.getAll();
         return response.data;
       },
     });
   }
   ```

### 3. Error Handling Enhancement

1. **Global Error Handler**:

   - Create error boundary for API errors
   - Implement retry mechanism
   - Add error reporting

2. **Type Safety**:
   - Add comprehensive DTOs
   - Implement Zod validation
   - Add runtime type checking

### 4. Testing Strategy

1. **Unit Tests**:

   - Test API client configuration
   - Test interceptors
   - Test error handling

2. **Integration Tests**:
   - Test auth flow
   - Test CRUD operations
   - Test error scenarios

## Integration Checklist for New APIs

When integrating new endpoints:

1. **Configuration**:

   - [ ] Add endpoint to `API_CONFIG`
   - [ ] Create appropriate DTOs
   - [ ] Add service file

2. **Implementation**:

   - [ ] Create service with CRUD operations
   - [ ] Implement React Query hook
   - [ ] Add error handling
   - [ ] Add loading states

3. **Testing**:

   - [ ] Test with auth token
   - [ ] Test without auth token
   - [ ] Test error scenarios
   - [ ] Test loading states

4. **Documentation**:
   - [ ] Update API documentation
   - [ ] Add example usage
   - [ ] Document error cases

## Conclusion

This implementation provides a robust foundation for API integration with:

- Secure authentication handling
- Comprehensive error management
- Detailed logging
- Type safety
- React Query integration

For developers:

1. Always check auth token presence
2. Use the provided service pattern
3. Implement proper error handling
4. Add detailed logging
5. Maintain type safety

Remember to update this documentation as new features are implemented or when integration patterns change.
