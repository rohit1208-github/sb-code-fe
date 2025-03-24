# Menu API Integration Documentation

## Overview

This document details the implementation of the menu management system's API integration with the backend endpoint at `http://34.60.128.41:8000/api/content/menu-items/`. The integration follows Next.js best practices, implements proper TypeScript types, and includes comprehensive error handling and loading states.

## Technical Implementation

### 1. Type Definitions (`types/api.ts`)

```typescript
export interface MenuItem {
  id: number;
  microsites: number[];
  name: string;
  description: string;
  price: string;
  currency: string;
  currency_display: string;
  image: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateMenuItemDto {
  name: string;
  description: string;
  price: string;
  currency: string;
  is_active: boolean;
}

export interface UpdateMenuItemDto extends Partial<CreateMenuItemDto> {
  id: number;
}
```

Key features:

- Strong TypeScript typing for API responses
- Separate DTOs for create and update operations
- Partial type for update operations to allow selective updates

### 2. API Service Layer (`services/menu.service.ts`)

```typescript
const MenuService = {
  getAll: async () => {...},
  getById: async (id: number) => {...},
  create: async (data: CreateMenuItemDto) => {...},
  update: async ({ id, ...data }: UpdateMenuItemDto) => {...},
  delete: async (id: number) => {...}
}
```

Features:

- Centralized API communication
- Comprehensive error handling
- Detailed logging for debugging
- Consistent error messages
- Type-safe request/response handling

### 3. React Query Hook (`hooks/useMenu.ts`)

```typescript
export function useMenu() {
  // Query implementation
  const { data: menuItems, isLoading } = useQuery({...})

  // Mutations
  const createMutation = useMutation({...})
  const updateMutation = useMutation({...})
  const deleteMutation = useMutation({...})

  return {
    menuItems,
    isLoading,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    isCreating,
    isUpdating,
    isDeleting
  }
}
```

Features:

- Automatic cache invalidation
- Loading states for operations
- Toast notifications for success/error
- Type-safe mutation handlers
- Optimistic updates

### 4. UI Components

#### 4.1 Menu Page (`app/(admin)/manage-components/menu/page.tsx`)

```typescript
export default function MenuPage() {
  const { menuItems, isLoading, deleteMenuItem, isDeleting } = useMenu();
  // Implementation
}
```

Features:

- Loading skeletons
- Error handling
- Responsive table layout
- Status indicators
- Action buttons

#### 4.2 Menu Dialog (`app/(admin)/manage-components/menu/components/menu-dialog.tsx`)

```typescript
export function MenuDialog({ mode, menuItem, trigger }: MenuDialogProps) {
  const { createMenuItem, updateMenuItem, isCreating, isUpdating } = useMenu();
  // Implementation
}
```

Features:

- Form validation with Zod
- Loading states
- Error messages
- Dynamic mode (add/edit)
- Type-safe form handling

## Implementation Details

### 1. API Integration Flow

1. **Data Fetching**:

   - React Query manages the cache
   - Automatic background refetching
   - Loading states during fetch

2. **Create Operation**:

   - Form validation
   - API call through service layer
   - Cache invalidation
   - Success/error notifications

3. **Update Operation**:

   - Pre-filled form data
   - Partial updates
   - Optimistic UI updates
   - Loading states

4. **Delete Operation**:
   - Confirmation handling
   - Cache invalidation
   - Loading states
   - Error handling

### 2. Error Handling Strategy

1. **Service Layer**:

   - Detailed error logging
   - Error transformation
   - Consistent error format

2. **UI Layer**:
   - Toast notifications
   - Form error messages
   - Loading states
   - Disabled states during operations

### 3. Performance Optimizations

1. **Caching**:

   - React Query caching
   - Automatic background updates
   - Optimistic updates

2. **Loading States**:
   - Skeleton loaders
   - Button loading states
   - Disabled states during operations

## Next Steps

### 1. PUT Integration for Edit Button

- Implement optimistic updates
- Add loading states
- Handle validation errors
- Add success/error notifications

### 2. DELETE Integration for Delete Icon

- Add confirmation dialog
- Implement optimistic deletion
- Handle errors gracefully
- Show loading state

### 3. POST Integration for Add Menu Item

- Implement form validation
- Add loading states
- Handle success/error cases
- Clear form after success

### 4. Future Improvements

1. **UI Enhancements**:

   - Add image upload functionality
   - Implement sorting and filtering
   - Add bulk operations
   - Enhance mobile responsiveness

2. **Performance**:

   - Implement infinite scrolling
   - Add request debouncing
   - Optimize re-renders
   - Add request caching

3. **Error Handling**:

   - Add retry mechanism
   - Implement offline support
   - Add error boundaries
   - Enhance error messages

4. **Testing**:
   - Add unit tests
   - Add integration tests
   - Add E2E tests
   - Add error scenario tests

## Best Practices

1. **Code Organization**:

   - Separate concerns (service/hooks/components)
   - Type-safe implementations
   - Consistent error handling
   - Clear component hierarchy

2. **State Management**:

   - Use React Query for server state
   - Local state for UI
   - Loading states
   - Error states

3. **Error Handling**:

   - User-friendly messages
   - Detailed logging
   - Graceful degradation
   - Recovery mechanisms

4. **Performance**:
   - Optimize re-renders
   - Implement caching
   - Use loading skeletons
   - Lazy loading

## POST API Implementation & Error Resolution

### 1. Initial Error

When attempting to create a menu item, we encountered the following error:

```json
{
  "detail": "Unsupported media type \"application/json\" in request."
}
```

### 2. Root Cause Analysis

The server was rejecting JSON content type for this specific endpoint, requiring form data instead.

### 3. Solution Implemented

We modified the create method in the menu service to use FormData:

```typescript
create: async (data: CreateMenuItemDto) => {
  console.log("MenuService: Creating new menu item:", data);
  try {
    const formData = new FormData();
    Object.entries({ ...data, microsite: 0 }).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    const response = await apiClient.post<MenuItem>(BASE_URL, formData);
    console.log("MenuService: Successfully created menu item:", response.data);
    return response.data;
  } catch (error) {
    console.error("MenuService: Error creating menu item:", error);
    throw error;
  }
};
```

Key changes made:

- Switched from JSON payload to FormData
- Automatically handles the correct content-type header
- Converts all values to strings for proper form data formatting
- Maintains the same interface and type safety

### 4. Benefits of the Solution

1. **Compatibility**: Works with server's expected format
2. **Type Safety**: Maintains TypeScript type checking
3. **Simplicity**: No need for manual content-type headers
4. **Reliability**: Proper data serialization

### 5. Testing Guidelines

When testing the menu item creation:

1. Verify all fields are properly sent
2. Check that boolean values are correctly converted
3. Confirm the microsite default value is included
4. Validate the response format matches MenuItem type

## Conclusion

The menu API integration provides a robust foundation for managing menu items. The implementation follows best practices, includes comprehensive error handling, and provides a smooth user experience. Future improvements will focus on enhancing functionality, performance, and user experience.
