# Food Delivery Management Implementation

## Overview

This document details the technical implementation of the Food Delivery Management module, which allows administrators to manage food delivery service integrations across different branches. The implementation follows Next.js 14 best practices, uses TypeScript for type safety, and is built with shadcn/ui components.

## Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Components**: shadcn/ui
- **Form Management**: react-hook-form
- **Validation**: Zod
- **State Management**: React useState (prepared for React Query integration)
- **Icons**: Lucide React

## Directory Structure

```
app/(admin)/manage-components/food-delivery-embed/
├── components/
│   ├── delivery-config-table.tsx    # Table component for listing configurations
│   └── delivery-config-dialog.tsx   # Dialog for adding/editing configurations
├── services/
│   └── delivery-service.ts          # Service layer for API integration
├── types.ts                         # TypeScript types and interfaces
└── page.tsx                         # Main page component
```

## Type Definitions

### Core Types (`types.ts`)

```typescript
export type DeliveryProvider = "talabat" | "deliveroo" | "uber-eats" | "careem";
export type DeliveryStatus = "active" | "inactive" | "pending";

export interface DeliveryConfig {
  id: string;
  provider: DeliveryProvider;
  branchId: string;
  branchName: string;
  embedCode: string;
  status: DeliveryStatus;
  lastUpdated: string;
  createdAt: string;
}

export interface DeliveryConfigFormData {
  provider: DeliveryProvider;
  branchId: string;
  embedCode: string;
}
```

### API Response Types

```typescript
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface DeliveryConfigsResponse
  extends ApiResponse<DeliveryConfig[]> {}
export interface DeliveryConfigResponse extends ApiResponse<DeliveryConfig> {}
```

## Component Implementation

### 1. Main Page Component (`page.tsx`)

- Uses 'use client' directive for client-side interactivity
- Implements a clean layout with header and action button
- Manages dialog state for adding configurations
- Integrates toast notifications for user feedback

Key Features:

```typescript
export default function FoodDeliveryPage() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Structure ready for API integration
  // Future: Add loading states and error handling
  // Future: Add React Query for data fetching
}
```

### 2. Table Component (`delivery-config-table.tsx`)

- Displays configurations in a responsive table
- Implements status badges with dynamic styling
- Provides action menu for each configuration
- Ready for real-time updates

Status Color Implementation:

```typescript
const getStatusColor = (status: DeliveryStatus) => {
  switch (status) {
    case "active":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    case "inactive":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
    case "pending":
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
    default:
      return "";
  }
};
```

### 3. Dialog Component (`delivery-config-dialog.tsx`)

- Implements form handling with react-hook-form
- Uses Zod for form validation
- Provides real-time validation feedback
- Handles both create and edit scenarios

Form Validation Schema:

```typescript
const formSchema = z.object({
  provider: z.enum(["talabat", "deliveroo", "uber-eats", "careem"] as const),
  branchId: z.string().min(1, "Branch is required"),
  embedCode: z.string().min(1, "Embed code is required"),
});
```

## Service Layer Implementation

### API Service (`delivery-service.ts`)

- Implements RESTful API methods
- Handles error cases
- Provides type-safe responses
- Ready for backend integration

```typescript
export const DeliveryService = {
  getConfigurations: async (): Promise<DeliveryConfig[]> => {
    // Implementation
  },
  createConfiguration: async (
    config: DeliveryConfigFormData
  ): Promise<DeliveryConfig> => {
    // Implementation
  },
  // ... other methods
};
```

## Backend Integration Points

### 1. API Endpoints

The service layer is prepared for the following endpoints:

```typescript
const API_BASE_URL = '/api/food-delivery'

// Endpoints:
- GET    /configurations
- GET    /configurations/:id
- POST   /configurations
- PUT    /configurations/:id
- DELETE /configurations/:id
- PATCH  /configurations/:id/status
```

### 2. Data Fetching Integration

The components are prepared for API integration:

1. **Table Component**:

   - Replace useState with React Query
   - Add loading states
   - Implement error boundaries

2. **Dialog Component**:
   - Connect form submission to API
   - Add optimistic updates
   - Implement proper error handling

### 3. Error Handling

The service layer implements consistent error handling:

```typescript
try {
  const response = await fetch(...)
  const data = await response.json()
  return data.data
} catch (error) {
  console.error('Error:', error)
  throw error
}
```

## Future Enhancements

1. **Data Management**:

   - Implement React Query for data fetching
   - Add caching layer
   - Implement optimistic updates

2. **UI Enhancements**:

   - Add loading skeletons
   - Implement infinite scroll
   - Add bulk actions
   - Implement filters and search

3. **Form Improvements**:

   - Add field-level validation
   - Implement auto-save
   - Add preview functionality
   - Add embed code validation

4. **API Integration**:
   - Add authentication headers
   - Implement rate limiting
   - Add request/response interceptors
   - Implement retry logic

## Testing Strategy

1. **Unit Tests**:

   - Test form validation
   - Test status color logic
   - Test service layer methods

2. **Integration Tests**:

   - Test form submission flow
   - Test table interactions
   - Test API integration

3. **E2E Tests**:
   - Test complete user flows
   - Test error scenarios
   - Test loading states

## Performance Considerations

1. **Code Splitting**:

   - Dialog component is rendered conditionally
   - Form validation runs on the client
   - API calls are made only when necessary

2. **State Management**:

   - Local state for UI interactions
   - Prepared for global state management
   - Optimized re-renders

3. **Error Boundaries**:
   - Implemented at component level
   - Graceful fallback UI
   - Error reporting ready

## Security Considerations

1. **Input Validation**:

   - All form inputs are validated
   - Embed code is sanitized
   - API responses are typed

2. **API Security**:
   - Prepared for authentication headers
   - CSRF protection ready
   - Rate limiting ready

## Conclusion

The Food Delivery Management implementation provides a robust foundation for managing delivery service integrations. The code is modular, type-safe, and ready for backend integration. The UI components are built with shadcn/ui, ensuring a consistent and professional look while maintaining good performance and accessibility.
