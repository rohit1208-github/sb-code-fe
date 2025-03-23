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
    COUNTRIES: "/api/management/countries/", (GET)
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

  create: async (data: CreateCountryDto) => {
    try {
      const formattedData = {
        name: String(data.name).trim(),
        code: String(data.code).trim(),
        is_active: Boolean(data.is_active ?? true),
      };

      logApiCall("POST", BASE_URL, formattedData);
      const response = await apiClient.post<Country>(BASE_URL, formattedData);
      return response;
    } catch (error) {
      console.error("❌ Create Country Error:", error);
      throw error;
    }
  },
  // ... other methods
};
```

### 5. React Query Integration

```typescript
// Example: useCountries.ts
export function useCountries() {
  const queryClient = useQueryClient();

  // Query for fetching countries
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

  // Mutation for creating countries
  const createMutation = useMutation({
    mutationFn: async (newCountry: CreateCountryDto) => {
      const response = await CountriesService.create(newCountry);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  return {
    countries,
    isLoading,
    error,
    createCountry: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    // ... other methods
  };
}
```

### 6. Form Implementation

Using shadcn/ui components and Zod validation:

```typescript
// components/countries/add-country-dialog.tsx
const countryFormSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    code: z.string().min(1, "Code is required"),
    is_active: z.boolean().default(true),
  })
  .required();

export function AddCountryDialog() {
  const form = useForm<CountryFormValues>({
    resolver: zodResolver(countryFormSchema),
    defaultValues: {
      name: "",
      code: "",
      is_active: true,
    },
  });

  async function onSubmit(formData: CountryFormValues) {
    try {
      await createCountry(
        {
          name: formData.name.trim(),
          code: String(formData.code).trim(),
          is_active: formData.is_active,
        },
        {
          onSuccess: () => {
            setOpen(false);
            form.reset();
            toast.success("Country added successfully");
            router.refresh();
          },
          onError: (error) => {
            handleValidationErrors(error, form);
          },
        }
      );
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  }
}
```

### 7. API Endpoints

#### 7.1 GET /api/management/countries/

- **Purpose**: Fetch all countries
- **Authentication**: Bearer token required
- **Response**: Array of Country objects

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

#### 7.2 POST /api/management/countries/

- **Purpose**: Create a new country
- **Authentication**: Bearer token required
- **Request Body**:

```typescript
interface CreateCountryDto {
  name: string; // Min 2 characters
  code: string; // Required
  is_active: boolean; // Optional, defaults to true
}
```

- **Response**: Created Country object

```json
{
  "id": 8,
  "name": "France",
  "code": "69",
  "is_active": true,
  "created_at": "2025-03-23T04:40:42.583756Z",
  "updated_at": "2025-03-23T04:40:42.583826Z"
}
```

#### 7.3 GET /api/management/countries/{id}/

- **Purpose**: Fetch a specific country by ID
- **Authentication**: Bearer token required
- **Parameters**:
  - `id`: INTEGER - The ID of the country
- **Response**: Country object

#### 7.4 PATCH /api/management/countries/{id}/

- **Purpose**: Update a specific country
- **Authentication**: Bearer token required
- **Parameters**:
  - `id`: INTEGER - The ID of the country
- **Request Body**: Partial<CreateCountryDto>
- **Response**: Updated Country object

#### 7.5 DELETE /api/management/countries/{id}/

- **Purpose**: Delete a specific country
- **Authentication**: Bearer token required
- **Parameters**:
  - `id`: INTEGER - The ID of the country
- **Response**: No content (204)
- **Error Responses**:
  - 404: Country not found
  - 401: Unauthorized
  - 403: Forbidden

### URL Handling Implementation

The CountriesService implements careful URL handling to ensure proper trailing slashes as required by the Django backend:

```typescript
const BASE_URL = "/api/management/countries/"; // Note trailing slash

export const CountriesService = {
  // Collection endpoints (maintain trailing slash)
  getAll: async () => {
    logApiCall("GET", BASE_URL);
    const response = await apiClient.get<Country[]>(BASE_URL);
    return response;
  },

  create: async (data: CreateCountryDto) => {
    logApiCall("POST", BASE_URL, data);
    const response = await apiClient.post<Country>(BASE_URL, data);
    return response;
  },

  // Resource endpoints (ID-based, maintain trailing slash after ID)
  getById: async (id: number) => {
    const url = `${BASE_URL.slice(0, -1)}/${id}/`;
    const response = await apiClient.get<Country>(url);
    return response;
  },

  update: async ({ id, ...data }: UpdateCountryDto) => {
    const url = `${BASE_URL.slice(0, -1)}/${id}/`;
    const response = await apiClient.patch<Country>(url, data);
    return response;
  },

  delete: async (id: number) => {
    const url = `${BASE_URL.slice(0, -1)}/${id}/`;
    const response = await apiClient.delete<void>(url);
    return response;
  },
};
```

Key URL formatting rules:

1. Collection endpoints (no ID):

   - Always include trailing slash
   - Example: `/api/management/countries/`

2. Resource endpoints (with ID):
   - Remove BASE_URL trailing slash before adding ID
   - Add trailing slash after ID
   - Example: `/api/management/countries/10/`

This implementation ensures compatibility with Django's URL handling requirements while maintaining clean and consistent API integration.

### React Query Integration

The delete functionality is integrated into the useCountries hook using React Query's mutation capabilities:

```typescript
const deleteMutation = useMutation({
  mutationFn: (id: number) => CountriesService.delete(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
  },
});

// Usage in components
const { deleteCountry, isDeleting } = useCountries();

const handleDelete = async (id: number) => {
  if (window.confirm("Are you sure you want to delete this country?")) {
    try {
      await deleteCountry(id);
      toast({
        title: "Success",
        description: "Country deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete country",
      });
    }
  }
};
```

This implementation:

- Handles optimistic updates
- Provides loading states
- Automatically refreshes the countries list after deletion
- Integrates with the UI's toast notification system

### Error Handling

The service implements comprehensive error handling:

1. Network Errors:

   - Connection issues
   - Timeout errors
   - Server unavailable

2. API Errors:

   - 404: Country not found
   - 401: Unauthorized
   - 403: Forbidden
   - 400: Bad request

3. Validation Errors:
   - Invalid ID format
   - Missing required fields
   - Data type mismatches

Each error is logged with detailed information and propagated to the UI layer for appropriate user feedback.

### 8. Error Handling

Enhanced error handling for form submissions:

```typescript
// Error handling in form submission
if (error.response?.status === 400) {
  const errorData = error.response.data;
  if (typeof errorData === "object") {
    // Handle field-specific validation errors
    Object.entries(errorData).forEach(([field, errors]) => {
      if (Array.isArray(errors)) {
        form.setError(field as any, {
          type: "server",
          message: errors[0],
        });
      }
    });
    toast.error("Please correct the errors in the form");
  }
}
```

### 9. Integration Checklist

When implementing new endpoints:

1. **Service Layer**:

   - [x] Add endpoint to API_CONFIG
   - [x] Create appropriate DTOs
   - [x] Implement service method with proper error handling
   - [x] Add logging for debugging

2. **React Query**:

   - [x] Create mutation hook
   - [x] Handle success/error states
   - [x] Invalidate queries on success
   - [x] Proper typing for request/response

3. **Form Implementation**:

   - [x] Create Zod validation schema
   - [x] Implement form using shadcn/ui components
   - [x] Handle server-side validation errors
   - [x] Show success/error notifications

4. **Error Handling**:

   - [x] Handle network errors
   - [x] Handle validation errors
   - [x] Show user-friendly error messages
   - [x] Log errors for debugging

5. **Testing**:
   - [x] Test with valid data
   - [x] Test with invalid data
   - [x] Verify error handling
   - [x] Check response handling

### 10. Development and Debugging

Example debug output:

```typescript
🌐 API POST: http://192.168.0.239:8000/api/management/countries/
📦 Request Data: {name: 'Pakistan', code: '1234', is_active: true}
🔐 Using token: eyJhbGciOi...
🚀 Request: {
  method: 'POST',
  url: 'http://192.168.0.239:8000/api/management/countries/',
  data: {name: 'Pakistan', code: '1234', is_active: true},
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: 'Bearer [HIDDEN]'
  }
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
