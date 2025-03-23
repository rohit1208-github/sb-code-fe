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
├── useCountries.ts       # React Query hook for countries data
components/
├── branches/
│   ├── branches-table.tsx # Branch listing and management table
│   ├── branch-dialog.tsx  # Add/Edit branch dialog
│   └── delete-branch-dialog.tsx # Delete confirmation dialog
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

The service layer (`services/branches.service.ts`) implements full CRUD functionality:

```typescript
export interface CreateBranchDto {
  name: string;
  country: number;
  address: string;
  phone: string;
  email: string;
  is_active: boolean;
  has_online_ordering: boolean;
}

export interface UpdateBranchDto extends CreateBranchDto {
  id: number;
}

export const BranchesService = {
  getAll: async () => {
    console.log("Fetching all branches");
    const response = await apiClient.get<Branch[]>(BASE_URL);
    return response;
  },

  create: async (data: CreateBranchDto) => {
    try {
      console.log(
        "Creating new branch with data:",
        JSON.stringify(data, null, 2)
      );
      const response = await apiClient.post<Branch>(BASE_URL, data);
      console.log("Create branch response:", response);
      return response;
    } catch (error: any) {
      console.error("Create branch error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },

  update: async ({ id, ...data }: UpdateBranchDto) => {
    console.log(`Updating branch ${id} with data:`, data);
    const url = `${BASE_URL}${id}/`;
    const response = await apiClient.put<Branch>(url, data);
    return response;
  },

  delete: async (id: number) => {
    console.log(`Deleting branch ${id}`);
    const url = `${BASE_URL}${id}/`;
    const response = await apiClient.delete(url);
    return response;
  },
};
```

### 4. React Query Integration

The `useBranches` hook provides a type-safe interface for managing branch data with proper cache invalidation:

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

  const createMutation = useMutation({
    mutationFn: BranchesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: BranchesService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: BranchesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  return {
    branches,
    isLoading,
    createBranch: createMutation.mutateAsync,
    updateBranch: updateMutation.mutateAsync,
    deleteBranch: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
```

### 5. UI Components

#### 5.1 Branch Dialog Component

The `BranchDialog` component implements:

- Form validation using Zod schema
- Country selection dropdown with data from `useCountries` hook
- Error handling with field-level validation
- Success notifications using Sonner
- Loading states for API operations
- Proper form reset on success
- Detailed error logging

#### 5.2 Delete Confirmation Dialog

The `DeleteBranchDialog` component provides:

- User-friendly confirmation UI
- Error handling
- Success notifications
- Loading states during deletion

#### 5.3 Branches Table

The `BranchesTable` component features:

- Responsive layout using Shadcn UI
- Loading and empty states
- Status badges for active/inactive states
- Online ordering status display
- Integrated action buttons for edit and delete operations
- Single "Add Branch" button with proper dialog integration

## Integration Checklist

### 1. API Integration

- [x] Add DTOs for create/update operations
- [x] Implement service methods for CRUD operations
- [x] Add proper error handling with detailed logging
- [x] Add response type validation
- [x] Implement country selection integration

### 2. React Query Integration

- [x] Add mutations for create/update/delete
- [x] Implement proper cache invalidation
- [x] Add loading states
- [x] Implement error handling
- [x] Add success notifications

### 3. UI Components

- [x] Create branch dialog component with form validation
- [x] Edit branch dialog with pre-populated data
- [x] Delete confirmation dialog
- [x] Loading states for all operations
- [x] Error message display
- [x] Single "Add Branch" button implementation
- [x] Proper dialog triggers and state management

### 4. Enhanced Error Handling

- [x] Field-level validation errors
- [x] Network error handling
- [x] Proper error messages
- [x] Console logging for debugging

### 5. Form Validation

- [x] Zod schema implementation
- [x] Required field validation
- [x] Email format validation
- [x] Country selection validation
- [x] Form state management

## Technical Details

### 1. Form Validation Schema

```typescript
const branchFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  country: z.number().int().positive("Please select a country"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  phone: z.string().min(5, "Phone must be at least 5 characters"),
  email: z.string().email("Invalid email address"),
  is_active: z.boolean(),
  has_online_ordering: z.boolean(),
});
```

### 2. API Response Handling

- Success responses trigger cache invalidation
- Error responses include:
  - Field-level validation errors
  - Network errors
  - Server errors
  - Detailed error logging

### 3. State Management

- Form state managed by `react-hook-form`
- API state managed by `@tanstack/react-query`
- UI state (dialogs, loading) managed by local React state
- Country data managed by separate `useCountries` hook

### 4. Performance Optimizations

- Proper cache invalidation strategies
- Loading states to prevent double submissions
- Optimized re-renders using proper React patterns
- Type-safe implementations throughout

### 5. Security Considerations

- API calls require authentication
- Form data validation on both client and server
- Proper error handling for unauthorized actions
- Secure data transmission

## Next Steps

### 1. Additional Features

- [ ] Add sorting functionality to the table
- [ ] Implement pagination
- [ ] Add search functionality
- [ ] Implement bulk operations

### 2. Performance Enhancements

- [ ] Implement request debouncing
- [ ] Add infinite scrolling
- [ ] Optimize bundle size
- [ ] Add performance monitoring

### 3. UX Improvements

- [ ] Add keyboard navigation
- [ ] Implement drag-and-drop functionality
- [ ] Add bulk edit capabilities
- [ ] Enhance mobile responsiveness

## Conclusion

The branch management implementation now provides a robust, type-safe, and user-friendly interface for managing restaurant branches. The implementation follows best practices for React and TypeScript development, ensuring maintainability and scalability.
