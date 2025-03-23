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
components/
├── countries/
│   └── add-country-dialog.tsx  # Country management dialog
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

### 3. Countries Management Implementation

#### 3.1 Service Layer (`services/countries.service.ts`)

The CountriesService implements a complete CRUD interface for country management:

```typescript
export interface Country {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCountryDto {
  name: string;
  code: string;
  is_active: boolean;
}

export interface UpdateCountryDto extends CreateCountryDto {
  id: number;
}

export const CountriesService = {
  getAll: async () => {
    const response = await apiClient.get<Country[]>(BASE_URL);
    return response;
  },

  create: async (data: CreateCountryDto) => {
    const response = await apiClient.post<Country>(BASE_URL, data);
    return response;
  },

  update: async ({ id, ...data }: UpdateCountryDto) => {
    const url = `${BASE_URL}${id}/`;
    const response = await apiClient.patch<Country>(url, data);
    return response;
  },

  delete: async (id: number) => {
    const url = `${BASE_URL}${id}/`;
    const response = await apiClient.delete(url);
    return response;
  },
};
```

#### 3.2 React Query Integration (`hooks/useCountries.ts`)

The useCountries hook provides a type-safe interface for managing country data:

```typescript
export function useCountries() {
  const queryClient = useQueryClient();
  const QUERY_KEY = ["countries"];

  const { data: countries, isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const response = await CountriesService.getAll();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: CountriesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: CountriesService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  return {
    countries,
    isLoading,
    createCountry: createMutation.mutateAsync,
    updateCountry: updateMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}
```

#### 3.3 UI Component Integration (`components/countries/add-country-dialog.tsx`)

The CountryDialog component provides a reusable interface for creating and editing countries:

```typescript
interface CountryDialogProps {
  mode: "add" | "edit";
  country?: Country;
  trigger?: React.ReactNode;
}

export function CountryDialog({ mode, country, trigger }: CountryDialogProps) {
  // Form implementation with real-time validation
  const form = useForm<CountryFormValues>({
    resolver: zodResolver(countryFormSchema),
    defaultValues:
      mode === "edit" && country
        ? {
            name: country.name,
            code: country.code,
            is_active: country.is_active,
          }
        : defaultValues,
  });

  // Dynamic form updates
  useEffect(() => {
    if (mode === "edit" && country) {
      form.reset({
        name: country.name,
        code: country.code,
        is_active: country.is_active,
      });
    }
  }, [country, mode, form]);

  // Mutation handling with proper error management
  const createMutation = useMutation({
    mutationFn: createCountry,
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const updateMutation = useMutation({
    mutationFn: updateCountry,
    onSuccess: handleSuccess,
    onError: handleError,
  });
}
```

### 4. API Endpoints Documentation

#### 4.1 Countries Management API

1. **GET /api/management/countries/**

   - Purpose: Fetch all countries
   - Authentication: Bearer token required
   - Response: Array of Country objects

   ```typescript
   interface Country {
     id: number;
     name: string;
     code: string;
     is_active: boolean;
     created_at: string;
     updated_at: string;
   }
   ```

2. **POST /api/management/countries/**

   - Purpose: Create a new country
   - Authentication: Bearer token required
   - Request Body:

   ```typescript
   interface CreateCountryDto {
     name: string; // Min 2 characters
     code: string; // Required
     is_active: boolean; // Optional, defaults to true
   }
   ```

   - Response: Created Country object

3. **PATCH /api/management/countries/{id}/**

   - Purpose: Update a specific country
   - Authentication: Bearer token required
   - Parameters: `id` (number)
   - Request Body: Partial<CreateCountryDto>
   - Response: Updated Country object

4. **DELETE /api/management/countries/{id}/**
   - Purpose: Delete a specific country
   - Authentication: Bearer token required
   - Parameters: `id` (number)
   - Response: 204 No Content

### 5. Error Handling Implementation

The implementation includes comprehensive error handling:

```typescript
const handleError = (error: any) => {
  console.error("Form submission error:", {
    status: error.response?.status,
    statusText: error.response?.statusText,
    data: error.response?.data,
    message: error.message,
  });

  if (error.response?.status === 400) {
    // Handle validation errors
    const errorData = error.response.data;
    if (typeof errorData === "object") {
      Object.entries(errorData).forEach(([field, errors]) => {
        if (Array.isArray(errors)) {
          form.setError(field as any, {
            type: "server",
            message: errors[0],
          });
        }
      });
    }
  }

  // Display user-friendly error message
  toast({
    variant: "destructive",
    title: "Error",
    description:
      error.response?.data?.detail ||
      error.message ||
      `Failed to ${mode} country`,
  });
};
```

### 6. Integration with Project Architecture

This implementation aligns with the project architecture outlined in `project-description.md`:

1. **Route Integration**: Countries management is integrated under the admin route group:

   ```
   app/(admin)/sb-management/countries/
   ```

2. **Component Hierarchy**:

   - CountryDialog (Reusable dialog for add/edit)
   - CountriesTable (Display and management)
   - Form components from shadcn/ui

3. **State Management**:

   - React Query for server state
   - React Hook Form for form state
   - Local state for UI elements

4. **Type Safety**:
   - Zod schemas for validation
   - TypeScript interfaces for API types
   - Proper error typing

### 7. Future Enhancements

1. **Optimistic Updates**:

   - Implement optimistic updates for better UX
   - Add rollback functionality for failed operations

2. **Caching Strategy**:

   - Implement stale-while-revalidate
   - Add proper cache invalidation rules

3. **Batch Operations**:

   - Add support for bulk create/update/delete
   - Implement proper error handling for batch operations

4. **Performance Optimization**:
   - Add pagination support
   - Implement infinite scrolling
   - Add search and filtering capabilities

This implementation provides a robust foundation for the SB Admin Console, following best practices for API integration, state management, and error handling.

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
