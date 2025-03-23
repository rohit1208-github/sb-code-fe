# Branch Management Integration


## Overview

This document details the branch management implementation for the SB Admin Console, following the same architecture patterns used in the countries management section. The implementation provides a secure, type-safe way to interact with the Django backend API for managing restaurant branches.

## Current Implementation

### 1. File Structure

```
lib/
├── api.ts                 # Core API client with interceptors
├── api-config.ts          # API configuration and endpoints
services/
├── branches.service.ts    # Branches API service
hooks/
├── useBranches.ts        # React Query hook for branches
components/
├── branches/
│   └── branches-table.tsx # Branch listing and management table
types/
└── api.ts                # Shared API types including Branch interface
```

### 2. API Integration

#### 2.1 Base Configuration (`lib/api-config.ts`)

```typescript
export const API_CONFIG = {
  BASE_URL: "http://192.168.0.239:8000",
  ENDPOINTS: {
    // ... other endpoints
    BRANCHES: "/api/management/branches/",
  },
} as const;
```

#### 2.2 Branch Type Definition (`types/api.ts`)

```typescript
export interface Branch {
  id: number;
  name: string;
  country: number;
  country_name: string;
  address: string;
  phone: string;
  email: string;
  is_active: boolean;
  has_online_ordering: boolean;
  created_at: string;
  updated_at: string;
}
```

### 3. Service Layer Implementation

The current service layer (`services/branches.service.ts`) implements the GET functionality for branches:

```typescript
export const BranchesService = {
  getAll: async () => {
    const response = await apiClient.get<Branch[]>(BASE_URL);
    return response;
  },
};
```

### 4. React Query Integration

The `useBranches` hook (`hooks/useBranches.ts`) provides a type-safe interface for managing branch data:

```typescript
export function useBranches() {
  const queryClient = useQueryClient();
  const QUERY_KEY = ["branches"];

  const { data: branches = [], isLoading } = useQuery<Branch[]>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const response = await BranchesService.getAll();
      return response.data;
    },
  });

  return {
    branches,
    isLoading,
  };
}
```

### 5. UI Components

#### 5.1 Branches Table (`components/branches/branches-table.tsx`)

The table component implements:

- Responsive layout using Shadcn UI
- Loading and empty states
- Status badges for active/inactive states
- Online ordering status display
- Action buttons for edit and delete operations (placeholders)

#### 5.2 Main Page (`app/(admin)/sb-management/branches/page.tsx`)

The page component provides:

- Branch listing with proper data fetching
- "Add Branch" button (placeholder)
- Loading state handling
- Error boundary support

## Planned CRUD Operations

### 1. Create Branch Operation

Will implement POST endpoint integration:

- Endpoint: `/api/management/branches/`
- Method: POST
- Authentication: Bearer token required

#### 1.1 Service Layer Extension

```typescript
// To be implemented
interface CreateBranchDto {
  name: string;
  country: number;
  address: string;
  phone: string;
  email: string;
  is_active: boolean;
  has_online_ordering: boolean;
}

// Service method to be added
create: async (data: CreateBranchDto) => {
  const response = await apiClient.post<Branch>(BASE_URL, data);
  return response;
};
```

### 2. Update Branch Operation

Will implement PUT endpoint integration:

- Endpoint: `/api/management/branches/{id}/`
- Method: PUT
- Authentication: Bearer token required

#### 2.1 Service Layer Extension

```typescript
// To be implemented
interface UpdateBranchDto extends CreateBranchDto {
  id: number;
}

// Service method to be added
update: async ({ id, ...data }: UpdateBranchDto) => {
  const response = await apiClient.put<Branch>(`${BASE_URL}${id}/`, data);
  return response;
};
```

### 3. Delete Branch Operation

Will implement DELETE endpoint integration:

- Endpoint: `/api/management/branches/{id}/`
- Method: DELETE
- Authentication: Bearer token required

#### 3.1 Service Layer Extension

```typescript
// Service method to be added
delete: async (id: number) => {
  const response = await apiClient.delete(`${BASE_URL}${id}/`)
  return response
}
```

## Next Steps

### 1. Create Branch Dialog

Will implement:

- Form with validation using Zod
- Country selection dropdown
- Error handling
- Success notifications
- Loading states

### 2. Edit Branch Dialog

Will implement:

- Pre-populated form with current branch data
- Form validation
- Error handling
- Success notifications
- Loading states

### 3. Delete Confirmation

Will implement:

- Confirmation dialog using Shadcn UI
- Error handling
- Success notifications
- Loading states

### 4. Enhanced Error Handling

Will implement:

- Field-level validation errors
- Network error handling
- Proper error messages
- Retry mechanisms

### 5. Optimistic Updates

Will implement:

- Optimistic UI updates for better UX
- Rollback on failure
- Loading states during operations

## Integration Checklist

When implementing the remaining CRUD operations:

1. **API Integration**:

   - [ ] Add DTOs for create/update operations
   - [ ] Implement service methods
   - [ ] Add proper error handling
   - [ ] Add response type validation

2. **React Query Integration**:

   - [ ] Add mutations for create/update/delete
   - [ ] Implement proper cache invalidation
   - [ ] Add optimistic updates
   - [ ] Handle loading states

3. **UI Components**:

   - [ ] Create branch dialog component
   - [ ] Edit branch dialog component
   - [ ] Delete confirmation dialog
   - [ ] Loading states for all operations
   - [ ] Error message display

4. **Testing**:
   - [ ] Test all CRUD operations
   - [ ] Test error scenarios
   - [ ] Test loading states
   - [ ] Test optimistic updates

## Conclusion

The current implementation provides a solid foundation for branch management with:

- Type-safe API integration
- Modern UI components
- Proper loading states
- Error handling

The next phase will focus on implementing the remaining CRUD operations following the same patterns used in the countries management section, ensuring a consistent and robust user experience.
