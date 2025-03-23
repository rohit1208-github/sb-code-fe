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
│           ├── page.tsx               # Main microsites listing page
│           └── components/
│               └── microsites-list.tsx # Microsites table component
lib/
├── api-config.ts                      # API configuration
├── api.ts                             # Base API client
services/
└── microsite.service.ts               # Microsite-specific API calls
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

## 5. UI Implementation

### 5.1 Main Page Structure

```typescript
// app/(admin)/websites/microsites-config/page.tsx
export default function MicrositesPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Microsites"
        description="Manage your microsites and their configurations."
      />
      <Suspense fallback={<div>Loading...</div>}>
        <MicrositesList />
      </Suspense>
    </div>
  );
}
```

### 5.2 Data Display

The MicrositesList component displays the following data:

- Microsite name and slug
- Associated branches with country information
- Section types with badges
- Active status
- Last updated date

## 6. Debugging & Error Handling

### 6.1 Console Logging

Comprehensive logging is implemented throughout the stack:

1. **Service Layer**:

   - API call initiation
   - Successful responses
   - Error states with details

2. **React Query Hooks**:

   - Query execution
   - Data reception
   - Error states

3. **UI Components**:
   - Component rendering
   - Data transformations
   - User interactions

### 6.2 Error States

Error handling is implemented at multiple levels:

1. Service layer with try/catch blocks
2. React Query error states
3. UI error boundaries and fallbacks

## 7. API Endpoints

### 7.1 GET /api/microsites/

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

## 8. Next Steps

1. **POST Implementation**:

   - Create microsite form
   - Validation schema
   - Success/error handling

2. **DELETE Implementation**:

   - Confirmation dialog
   - Optimistic updates
   - Error recovery

3. **PATCH Implementation**:
   - Edit form
   - Partial updates
   - Status toggle

## 9. Alignment with Project Architecture

This implementation follows the architecture defined in `project-description.md`:

1. **File Structure**: Follows the App Router pattern with admin route grouping
2. **Type Safety**: Comprehensive TypeScript interfaces
3. **API Layer**: Centralized service pattern
4. **State Management**: React Query for server state
5. **UI Components**: shadcn/ui integration
6. **Error Handling**: Multi-level error management
7. **Debugging**: Comprehensive logging system

The implementation is part of Phase 4 (Websites & Microsites Config) as outlined in the project phases.
