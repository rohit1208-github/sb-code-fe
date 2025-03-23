# Microsite API Integration Documentation

## Overview

This document details the implementation of the Microsite API integration in our Next.js 14 application, following the architecture outlined in `project-description.md`. The implementation uses TypeScript, React Query, and follows the App Router pattern.

## 1. API Integration Structure

### 1.1 File Structure

```
app/
├── (admin)/
│   └── websites/
│       └── microsites-config/
│           ├── page.tsx                    # Main microsites listing page
│           └── components/
│               ├── microsites-list.tsx     # Microsites table component
│               ├── add-microsite-form.tsx  # Form for creating new microsites
│               ├── add-microsite-dialog.tsx # Dialog wrapper for the form
│               └── branch-select.tsx       # Branch selection component
components/
├── ui/
│   ├── command.tsx                # Command menu component for search
│   ├── popover.tsx               # Popover component for dropdowns
│   ├── scroll-area.tsx           # Scrollable area component
│   ├── toast.tsx                 # Toast notification component
│   ├── toaster.tsx              # Toast container component
│   └── use-toast.ts             # Toast hook utilities
lib/
├── api-config.ts                      # API configuration
├── api.ts                             # Base API client
services/
├── microsite.service.ts               # Microsite-specific API calls
└── branch.service.ts                  # Branch-specific API calls
hooks/
└── useMicrosites.ts                   # React Query hooks for microsites
types/
└── microsites.ts                      # TypeScript interfaces
```

### 1.2 API Configuration

The microsite API uses the same base configuration as other APIs:

```typescript
// lib/api-config.ts
export const API_CONFIG = {
  BASE_URL: "http://192.168.0.239:8000",
  ENDPOINTS: {
    MICROSITES: "/api/microsites/",
  },
} as const;
```

## 2. Type Definitions

### 2.1 Response Types (`types/microsites.ts`)

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

export interface Section {
  id: number;
  section_type: string;
  section_type_display: string;
  display_order: number;
  is_active: boolean;
}

export interface Microsite {
  id: number;
  name: string;
  slug: string;
  branches: number[];
  branches_data: Branch[];
  is_active: boolean;
  has_language_switcher: boolean;
  secondary_language: string | null;
  sections: Section[];
  created_at: string;
  updated_at: string;
}

export type MicrositeResponse = Microsite[];

export interface CreateMicrositeDto {
  name: string;
  slug: string;
  branches: number[];
  is_active: boolean;
  has_language_switcher: boolean;
  secondary_language: string | null;
}
```

## 3. API Service Layer

### 3.1 Microsite Service (`services/microsite.service.ts`)

```typescript
import { apiClient } from "@/lib/api";
import type { Microsite, MicrositeResponse } from "@/types/microsites";

const BASE_URL = "/api/microsites/";

export const MicrositeService = {
  getAll: async () => {
    console.log("🔍 [MicrositeService] Fetching all microsites");
    try {
      const response = await apiClient.get<MicrositeResponse>(BASE_URL);
      console.log("✅ [MicrositeService] Successfully fetched microsites:", {
        count: response.data.length,
        status: response.status,
      });
      return response;
    } catch (error) {
      console.error("❌ [MicrositeService] Error fetching microsites:", {
        error,
        status: error.response?.status,
        message: error.message,
      });
      throw error;
    }
  },

  getById: async (id: number) => {
    console.log(`🔍 [MicrositeService] Fetching microsite by id: ${id}`);
    try {
      const response = await apiClient.get<Microsite>(`${BASE_URL}${id}/`);
      console.log("✅ [MicrositeService] Successfully fetched microsite:", {
        id,
        name: response.data.name,
        status: response.status,
      });
      return response;
    } catch (error) {
      console.error(`❌ [MicrositeService] Error fetching microsite ${id}:`, {
        error,
        status: error.response?.status,
        message: error.message,
      });
      throw error;
    }
  },

  create: async (data: CreateMicrositeDto) => {
    console.log("📝 [MicrositeService] Creating new microsite:", data);
    try {
      const response = await apiClient.post<Microsite>(BASE_URL, data);
      console.log("✅ [MicrositeService] Successfully created microsite:", {
        id: response.data.id,
        name: response.data.name,
        status: response.status,
      });
      return response;
    } catch (error) {
      console.error("❌ [MicrositeService] Error creating microsite:", {
        error,
        status: error.response?.status,
        message: error.message,
        data,
      });
      throw error;
    }
  },
};
```

### 3.2 Branch Service (`services/branch.service.ts`)

```typescript
export const BranchService = {
  getAll: async () => {
    console.log("🔍 [BranchService] Fetching all branches");
    try {
      const response = await apiClient.get<Branch[]>(BASE_URL);
      console.log("✅ [BranchService] Successfully fetched branches:", {
        count: response.data.length,
        status: response.status,
      });
      return response;
    } catch (error) {
      console.error("❌ [BranchService] Error fetching branches:", {
        error,
        status: error.response?.status,
        message: error.message,
      });
      throw error;
    }
  },
};
```

## 4. React Query Integration

### 4.1 Custom Hooks (`hooks/useMicrosites.ts`)

```typescript
import { useQuery } from "@tanstack/react-query";
import { MicrositeService } from "@/services/microsite.service";

export function useMicrosites() {
  const QUERY_KEY = ["microsites"];

  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const response = await MicrositeService.getAll();
      return response.data;
    },
  });
}

export function useMicrosite(id: number) {
  const QUERY_KEY = ["microsites", id];

  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const response = await MicrositeService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}
```

## 5. UI Components

### 5.1 Add Microsite Form (`components/add-microsite-form.tsx`)

The form component includes:

- Zod validation schema
- Form fields for all microsite properties
- React Query mutation for POST request
- Toast notifications for success/error states
- Branch selection integration

### 5.2 Branch Select Component (`components/branch-select.tsx`)

A reusable component that provides:

- Searchable branch selection
- Multi-select capability
- Real-time branch filtering
- Selected branches display with badges

### 5.3 Dialog Integration (`components/add-microsite-dialog.tsx`)

Modal dialog that:

- Wraps the add microsite form
- Provides a clean UI for microsite creation
- Handles dialog state and animations
- Integrates with the main microsites list

## 6. Form Validation

### 6.1 Zod Schema

```typescript
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  branches: z.array(z.number()).min(1, "At least one branch must be selected"),
  is_active: z.boolean().default(true),
  has_language_switcher: z.boolean().default(false),
  secondary_language: z.string().nullable(),
});
```

## 7. UI Components Dependencies

### 7.1 Shadcn/UI Components

The implementation uses the following shadcn/ui components:

- Command (cmdk)
- Popover (@radix-ui/react-popover)
- ScrollArea (@radix-ui/react-scroll-area)
- Toast
- Dialog
- Form components

## 8. API Endpoints

### 8.1 GET /api/microsites/

**Request**:

- Method: GET
- Authentication: Bearer Token
- Headers:
  ```json
  {
    "Authorization": "Bearer {token}"
  }
  ```

**Response**:

```typescript
[{
  "id": number,
  "name": string,
  "slug": string,
  "branches": number[],
  "branches_data": Branch[],
  "is_active": boolean,
  "has_language_switcher": boolean,
  "secondary_language": string | null,
  "sections": Section[],
  "created_at": string,
  "updated_at": string
}]
```

### 8.2 POST /api/microsites/

**Request**:

- Method: POST
- Authentication: Bearer Token
- Headers:
  ```json
  {
    "Authorization": "Bearer {token}",
    "Content-Type": "application/json"
  }
  ```
- Body:
  ```typescript
  {
    name: string
    slug: string
    branches: number[]
    is_active: boolean
    has_language_switcher: boolean
    secondary_language: string | null
  }
  ```

**Response**:

```typescript
{
  id: number
  name: string
  slug: string
  branches: number[]
  branches_data: Branch[]
  is_active: boolean
  has_language_switcher: boolean
  secondary_language: string | null
  sections: Section[]
  created_at: string
  updated_at: string
}
```

## 9. Error Handling

The implementation includes comprehensive error handling:

1. **Form Validation**:

   - Required field validation
   - Minimum length requirements
   - Branch selection validation

2. **API Error Handling**:

   - Network error handling
   - Server error responses
   - Validation error responses

3. **User Feedback**:
   - Toast notifications for success/error states
   - Form field error messages
   - Loading states during submission

## 10. Next Steps

1. **PUT/PATCH Implementation**:

   - Edit form implementation
   - Optimistic updates
   - Validation rules

2. **DELETE Implementation**:

   - Confirmation dialog
   - Optimistic deletion
   - Error recovery

3. **Additional Features**:
   - Bulk operations
   - Advanced filtering
   - Export functionality

## 11. Testing

Recommended test cases for the new functionality:

1. **Form Validation**:

   - Required fields
   - Field constraints
   - Error messages

2. **API Integration**:

   - Successful creation
   - Error handling
   - Loading states

3. **UI Components**:
   - Branch selection
   - Form submission
   - Dialog behavior
   - Toast notifications

## 12. Alignment with Project Architecture

This implementation follows the architecture defined in `project-description.md`:

1. **File Structure**: Follows the App Router pattern with admin route grouping
2. **Type Safety**: Comprehensive TypeScript interfaces
3. **API Layer**: Centralized service pattern
4. **State Management**: React Query for server state
5. **UI Components**: shadcn/ui integration
6. **Error Handling**: Multi-level error management
7. **Debugging**: Comprehensive logging system

The implementation is part of Phase 4 (Websites & Microsites Config) as outlined in the project phases.

## 13. Current Implementation Status and Known Issues

### 13.1 Branch Selection Component Status

The `BranchSelect` component has been reimplemented with a simplified dropdown approach, removing the Command component dependency:

```typescript
interface BranchSelectProps {
  branches: Branch[];
  value: number[];
  onChange: (value: number[]) => void;
}
```

#### Current Functionality

1. ✅ Successfully fetches and displays branches from the API
2. ✅ Simple, direct click-based selection mechanism
3. ✅ Shows selected branches as badges in the trigger button
4. ✅ Maintains proper state for selected branches
5. ✅ Implements proper TypeScript types and interfaces
6. ✅ Clean, performant implementation without complex dependencies

### 13.2 Implementation Details

The component uses a straightforward implementation with Popover and ScrollArea components:

```typescript
// Selection handler implementation
const handleSelect = React.useCallback((branchId: number) => {
  const newValue = value.includes(branchId)
    ? value.filter(id => id !== branchId)
    : [...value, branchId]
  onChange(newValue)
}, [value, onChange])

// Branch item rendering
<div
  key={branch.id}
  className={cn(
    'flex items-center space-x-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground',
    isSelected && 'bg-accent'
  )}
  onClick={() => handleSelect(branch.id)}
>
  <Check
    className={cn(
      'h-4 w-4',
      isSelected ? 'opacity-100' : 'opacity-0'
    )}
  />
  <span>{branch.name}</span>
</div>
```

### 13.3 Key Features

1. **Direct Selection Handling**:

   - Click events directly trigger selection
   - No intermediate component layers
   - Immediate visual feedback

2. **Visual Feedback**:

   - Selected items highlighted with accent background
   - Checkmark icon shows selection state
   - Hover states for better interaction feedback

3. **State Management**:

   - Clean state updates using React.useCallback
   - Efficient memoization of selected branches
   - Direct integration with form state

4. **Accessibility**:
   - Proper ARIA attributes for the combobox
   - Keyboard navigation support
   - Clear visual indicators

### 13.4 Integration with Form Component

The `BranchSelect` component maintains its clean integration with the `AddMicrositeForm`:

```typescript
<FormField
  control={form.control}
  name="branches"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Branches</FormLabel>
      <FormControl>
        <BranchSelect
          branches={branchesData?.data || []}
          value={field.value}
          onChange={field.onChange}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### 13.5 Component Dependencies

The simplified implementation uses these core components:

- Popover (for dropdown functionality)
- ScrollArea (for scrollable content)
- Button (for trigger)
- Badge (for selected items display)

### 13.6 Performance Considerations

The new implementation offers several performance benefits:

1. **Reduced Complexity**:

   - Fewer component layers
   - Simpler state management
   - Direct event handling

2. **Optimized Rendering**:

   - Efficient memoization
   - Minimal re-renders
   - Lightweight DOM structure

3. **Better Resource Usage**:
   - No search filtering overhead
   - Simplified state updates
   - Reduced memory footprint
