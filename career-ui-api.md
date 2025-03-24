# Careers UI Implementation & API Integration Guide

## Overview

This document details the technical implementation of the Careers Management UI module in the admin console. The implementation follows Next.js 14 best practices, uses TypeScript for type safety, and is built with shadcn/ui components.

## Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Components**: shadcn/ui
- **Form Management**: react-hook-form with Zod validation
- **State Management**: React useState (prepared for React Query integration)
- **Icons**: Lucide React

## Directory Structure

```
app/(admin)/manage-components/careers/
├── components/
│   ├── careers-table.tsx    # Table component for listing careers
│   └── career-form-dialog.tsx   # Dialog for adding/editing careers
├── services/
│   └── careers-service.ts   # Service layer for API integration
├── types.ts                 # TypeScript types and interfaces
└── page.tsx                 # Main page component
```

## Type Definitions (`types.ts`)

### Core Types

```typescript
export type CareerStatus = "active" | "inactive" | "draft";
export type JobType = "full-time" | "part-time" | "contract" | "internship";
export type ExperienceLevel = "entry" | "mid" | "senior" | "lead";

export interface CareerPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  description: string;
  requirements: string[];
  status: CareerStatus;
  branchId?: string;
  branchName?: string;
  postedDate: string;
  lastUpdated: string;
}
```

### Form Data Type

```typescript
export interface CareerPostingFormData {
  title: string;
  department: string;
  location: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  description: string;
  requirements: string[];
  branchId?: string;
}
```

### API Response Types

```typescript
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface CareerPostingsResponse extends ApiResponse<CareerPosting[]> {}
export interface CareerPostingResponse extends ApiResponse<CareerPosting> {}
```

## Component Implementation

### 1. Main Page Component (`page.tsx`)

The main page component serves as the container for the careers management interface.

**Key Features**:

- Uses 'use client' directive for client-side interactivity
- Manages dialog state for adding/editing careers
- Integrates toast notifications for user feedback
- Prepared for API integration with mock data

**State Management**:

```typescript
const [open, setOpen] = useState(false);
const [careers] = useState<CareerPosting[]>([
  /* mock data */
]);
```

### 2. Table Component (`careers-table.tsx`)

Displays career postings in a responsive table format.

**Key Features**:

- Dynamic status badges with color coding
- Action menu for each row
- Sortable columns (prepared)
- Mobile responsive design

**Status Color Implementation**:

```typescript
const getStatusColor = (status: CareerStatus) => {
  switch (status) {
    case "active":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    case "inactive":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
    case "draft":
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
    default:
      return "";
  }
};
```

### 3. Form Dialog Component (`career-form-dialog.tsx`)

Handles the creation and editing of career postings.

**Key Features**:

- Form validation using Zod
- Rich form controls
- Support for both create and edit modes
- Requirements handling with line-by-line input

**Form Validation Schema**:

```typescript
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  department: z.string().min(1, "Department is required"),
  location: z.string().min(1, "Location is required"),
  jobType: z.enum([
    "full-time",
    "part-time",
    "contract",
    "internship",
  ] as const),
  experienceLevel: z.enum(["entry", "mid", "senior", "lead"] as const),
  description: z.string().min(1, "Description is required"),
  requirements: z.string().transform((val) => val.split("\n").filter(Boolean)),
});
```

## API Integration Points

### Service Layer (`careers-service.ts`)

The service layer is prepared for backend integration with the following endpoints:

```typescript
const API_BASE_URL = '/api/careers';

export const CareersService = {
  // GET /api/careers
  getAll: async (): Promise<CareerPosting[]>

  // GET /api/careers/:id
  getById: async (id: string): Promise<CareerPosting>

  // POST /api/careers
  create: async (data: CareerPostingFormData): Promise<CareerPosting>

  // PATCH /api/careers/:id
  update: async (id: string, data: Partial<CareerPostingFormData>): Promise<CareerPosting>

  // DELETE /api/careers/:id
  delete: async (id: string): Promise<void>

  // PATCH /api/careers/:id/status
  updateStatus: async (id: string, status: CareerStatus): Promise<CareerPosting>
}
```

### Expected API Response Format

All API endpoints should return responses in the following format:

```typescript
{
  data: T,          // The actual response data
  message: string,  // A message describing the response
  success: boolean  // Whether the operation was successful
}
```

## Backend Integration Guide

### 1. API Endpoints Required

The backend needs to implement the following RESTful endpoints:

1. **GET /api/careers**

   - Returns: `CareerPostingsResponse`
   - Query Parameters:
     - page (optional): number
     - limit (optional): number
     - status (optional): CareerStatus
     - search (optional): string

2. **GET /api/careers/:id**

   - Returns: `CareerPostingResponse`
   - URL Parameters:
     - id: string

3. **POST /api/careers**

   - Body: `CareerPostingFormData`
   - Returns: `CareerPostingResponse`

4. **PATCH /api/careers/:id**

   - Body: `Partial<CareerPostingFormData>`
   - Returns: `CareerPostingResponse`

5. **DELETE /api/careers/:id**

   - Returns: void

6. **PATCH /api/careers/:id/status**
   - Body: `{ status: CareerStatus }`
   - Returns: `CareerPostingResponse`

### 2. Error Handling

The UI is prepared to handle API errors through:

- Toast notifications for user feedback
- Error boundaries for component failures
- Type-safe error responses

Expected error response format:

```typescript
{
  success: false,
  message: string,
  error?: {
    code: string,
    details?: unknown
  }
}
```

### 3. Future Enhancements

The implementation is prepared for the following enhancements:

1. **Data Management**:

   - Integration with React Query for data fetching
   - Optimistic updates
   - Infinite scroll pagination
   - Real-time updates

2. **UI Enhancements**:

   - Loading skeletons
   - Infinite scroll
   - Bulk actions
   - Advanced filtering
   - Search functionality

3. **Form Improvements**:
   - Rich text editor for description
   - Image uploads for job postings
   - Auto-save functionality
   - Draft system

## Testing Strategy

1. **Unit Tests**:

   - Form validation
   - Component rendering
   - Service layer methods

2. **Integration Tests**:

   - Form submission flow
   - API integration
   - Error handling

3. **E2E Tests**:
   - Complete user flows
   - API interaction
   - Error scenarios

## Security Considerations

1. **Input Validation**:

   - All form inputs are validated using Zod
   - API responses are type-checked
   - XSS prevention in place

2. **API Security**:
   - Prepared for authentication headers
   - CSRF protection ready
   - Rate limiting ready

## Conclusion

The Careers UI implementation provides a robust foundation for managing career postings. The code is modular, type-safe, and ready for backend integration. The UI components are built with shadcn/ui, ensuring a consistent and professional look while maintaining good performance and accessibility.
