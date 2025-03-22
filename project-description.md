 This document is designed so that **junior engineers** (and others) can reference it directly to begin development. It accommodates:

1. **Future API Endpoints** (currently unknown).  
2. **Authentication** (login page to be added later).  
3. **Branding/Theming** (can be integrated later).  

---

## 1. Preliminary Setup

### 1.1 Project Initialization

1. **Create the project** (using Next.js 13+ with the App Router):
   ```bash
   npx create-next-app@latest my-frontend --typescript
   ```
   - This generates a new Next.js TypeScript-based project in the `my-frontend` folder.

2. **Install dependencies** for Tailwind, shadcn/ui, and any other libraries:
   ```bash
   cd my-frontend
   # Tailwind
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   # shadcn/ui
   npx shadcn-ui@latest init
   # (Optional) Additional libraries such as axios, react-query, etc.
   npm install axios @tanstack/react-query
   ```

3. **Initialize Git** (if not done automatically):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

> **Note**: We’ll tailor the environment variables (e.g., API URLs, tokens) once the backend endpoints are defined. For now, placeholders will suffice.

### 1.2 Tailwind & shadcn/ui Configuration

1. **Update `tailwind.config.js`** to include the `app` directory and `node_modules` for shadcn if needed:
   ```js
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     content: [
       './app/**/*.{js,ts,jsx,tsx}',
       './components/**/*.{js,ts,jsx,tsx}',
       './node_modules/@shadcn/ui/dist/**/*.{js,ts,jsx,tsx}',
       // etc...
     ],
     theme: {
       extend: {
         // Custom brand colors or other theme extensions
       },
     },
     plugins: [],
   }
   ```

2. **shadcn/ui** setup:
   - You can generate components using the `shadcn-ui` CLI (e.g., `npx shadcn-ui add button card input ...`) to add pre-built UI elements.  
   - This ensures consistent theming and styling across the project.

---

## 2. High-Level Architecture & File Structure

We will use the **Next.js App Router** in `app/`, with an **(admin)** route group for all admin-related pages. Below is a **sample** folder structure, including placeholders for **future** authentication and API integration.

```
my-frontend/
├── app
│   ├── (admin)
│   │   ├── layout.tsx         # Shared layout for admin pages (sidebar, etc.)
│   │   ├── dashboard
│   │   │   └── page.tsx       # Admin dashboard page
│   │   ├── sb-management
│   │   │   ├── countries
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]
│   │   │   │       └── page.tsx
│   │   │   ├── branches
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]
│   │   │   │       └── page.tsx
│   │   │   ├── roles
│   │   │   │   └── page.tsx
│   │   │   ├── staff
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]
│   │   │   │       └── page.tsx
│   │   ├── websites
│   │   │   ├── base-template
│   │   │   │   └── page.tsx
│   │   │   └── microsites-config
│   │   │       └── page.tsx
│   │   ├── manage-components
│   │   │   ├── menu
│   │   │   │   └── page.tsx
│   │   │   ├── testimonials
│   │   │   │   └── page.tsx
│   │   │   ├── language-switcher
│   │   │   │   └── page.tsx
│   │   │   ├── food-delivery-embed
│   │   │   │   └── page.tsx
│   │   │   └── careers
│   │   │       └── page.tsx
│   │   ├── optimization
│   │   │   ├── whatsapp-links
│   │   │   │   └── page.tsx
│   │   │   └── seo
│   │   │       ├── page.tsx       # Base SEO settings
│   │   │       ├── pagewise
│   │   │       └── countrywise
│   ├── login
│   │   └── page.tsx               # Future login page
│   ├── layout.tsx                 # Root layout (applies to entire site)
│   └── page.tsx                   # Public home or redirect
├── components
│   ├── ui                         # Reusable UI elements (e.g. Buttons, Cards)
│   ├── admin                      # Admin-specific shared components
│   └── ...
├── lib
│   ├── api.ts                     # API abstraction layer (future endpoints)
│   └── auth.ts                    # (Future) Authentication methods
├── hooks
│   └── useFetchCountries.ts       # Example custom hook
├── services
│   └── countries.service.ts       # Example service for countries
├── styles
│   ├── globals.css
│   └── ...
├── public
│   └── images
├── .env.local                     # For local environment variables
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
├── package.json
└── tsconfig.json
```

> **Note**: This structure is a starting point. You can reorganize as needed over time.

---

## 3. Boilerplate Code Snippets

Below are code snippets you can **copy-paste** into your project as a starting point. They illustrate best practices and typical patterns.

### 3.1 Global Layout (`app/layout.tsx`)

```tsx
// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SB Frontend',
  description: 'A multi-branch restaurant admin console',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
```

### 3.2 Admin Layout (`app/(admin)/layout.tsx`)

Here we show a **sidebar** plus a top navigation placeholder for all admin pages.

```tsx
// app/(admin)/layout.tsx
import React from 'react'
import Link from 'next/link'
import '../../styles/admin.css' // If you want admin-specific styling

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4">
        <nav className="flex flex-col gap-2">
          <Link href="/(admin)/dashboard" className="text-blue-500 hover:underline">
            Dashboard
          </Link>
          <Link href="/(admin)/sb-management/countries">
            Countries
          </Link>
          <Link href="/(admin)/sb-management/branches">
            Branches
          </Link>
          <Link href="/(admin)/sb-management/staff">
            Staff
          </Link>
          {/* Add more links as needed */}
        </nav>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  )
}
```

### 3.3 Dashboard Page (`app/(admin)/dashboard/page.tsx`)

An example that shows how you might structure the **Dashboard** with placeholder data. We’ll incorporate [shadcn/ui components](https://ui.shadcn.com/docs) for a polished look.

```tsx
// app/(admin)/dashboard/page.tsx
import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Good Evening, [UserName]</h1>

      {/* Example row of cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Branches with Online Ordering</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">34</p>
            <p className="text-sm text-gray-500">3 new links added last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">30</p>
            <p className="text-sm text-gray-500">6 unread form entries</p>
          </CardContent>
        </Card>
        
        {/* Add more cards as needed */}
      </div>

      {/* Example traffic chart placeholder */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Traffic Analytics by Region</h2>
        <div className="bg-white p-4 rounded-md">
          {/* Insert chart library component here, e.g. <BarChart data={...} /> */}
          <p>Chart Placeholder</p>
        </div>
      </div>
    </div>
  )
}
```

### 3.4 Example CRUD Page (Countries)

#### 3.4.1 Viewing/Listing Countries

```tsx
// app/(admin)/sb-management/countries/page.tsx
import React from 'react'
import Link from 'next/link'

export default function CountriesPage() {
  // Mock data: Replace with actual fetch from your backend
  const countries = [
    { id: 1, name: 'USA' },
    { id: 2, name: 'India' },
    // ...
  ]

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Countries</h1>

      <Link href="/(admin)/sb-management/countries/create" className="text-blue-600 underline">
        Add New Country
      </Link>

      <ul className="mt-4">
        {countries.map(country => (
          <li key={country.id} className="flex justify-between mb-2">
            <span>{country.name}</span>
            <span>
              <Link href={`/(admin)/sb-management/countries/${country.id}`}>
                <button className="text-sm text-blue-500 mr-2">Edit</button>
              </Link>
              <button className="text-sm text-red-500">Delete</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

#### 3.4.2 Creating/Editing a Country

```tsx
// app/(admin)/sb-management/countries/[id]/page.tsx

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EditCountryPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  const isNew = params.id === 'create'
  const [formData, setFormData] = useState({ name: '' })

  // For editing, fetch country info from backend and set formData
  // useEffect(() => { ... }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // If new, POST. If existing, PATCH or PUT
    // Example:
    // await fetch(`API_URL/countries${isNew ? '' : `/${params.id}`}`, {
    //   method: isNew ? 'POST' : 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData),
    // })

    router.push('/(admin)/sb-management/countries')
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">
        {isNew ? 'Add New Country' : `Edit Country #${params.id}`}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Country Name</label>
          <input
            className="border p-2 w-full"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Save
        </button>
      </form>
    </div>
  )
}
```

> In the future, you’ll replace the **mock data** and placeholder fetch calls with **real** API endpoints once they’re provided.

---

## 4. API Layer & Future Integration

### 4.1 `lib/api.ts` (Centralizing Fetch Logic)

```ts
// lib/api.ts
import axios from 'axios'

// Base Axios Instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  timeout: 5000,
})

// Sample GET
export async function getCountries() {
  const response = await api.get('/countries')
  return response.data
}

// Sample POST
export async function createCountry(payload: { name: string }) {
  const response = await api.post('/countries', payload)
  return response.data
}

export default api
```

> **Usage**: In your pages or hooks, import `getCountries` or `createCountry` from `lib/api.ts`.

### 4.2 Handling Authentication

- For now, we do **not** implement a login page.  
- Later, we can add:
  ```tsx
  // app/login/page.tsx
  // ...
  // A form that calls `api.post('/auth/login', { email, password })`, sets a cookie or local storage token, etc.
  // ...
  ```
- Then guard admin routes with Next.js **middleware** or by checking tokens on the server.

---

## 5. Advanced Topics (Future Roadmap)

1. **Role-Based Access**  
   - Integrate a “role” check in each admin route or via Next.js [Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware) to redirect unauthorized users.

2. **SEO & Localization**  
   - Use the Next.js `<head>` via the new **Metadata API** in Next 13 for dynamic meta titles, descriptions, etc.  
   - For localization or language switchers, consider [next-intl](https://github.com/amannn/next-intl) or [react-i18next](https://react.i18next.com/).

3. **Charts and Graphs**  
   - Decide on a chart library like [Recharts](https://recharts.org/en-US/) or [react-chartjs-2](https://github.com/reactchartjs/react-chartjs-2).  
   - Store data in a global state or fetch it on the server for SSR.

4. **Testing**  
   - Add [Jest](https://jestjs.io/) or [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/docs/react-testing-library/intro/).  
   - Write unit tests for each UI component (especially forms, API calls, and key functionalities).

5. **Deployment**  
   - For an MVP or quick iteration, **Vercel** is recommended (native support for Next.js).  
   - You can then configure environment variables (API endpoints, secrets) directly in your Vercel project settings.

---

## 6. Implementation Phases (Recap)

1. **Phase 1**: Project Setup  
   - Initialize Next.js, Tailwind, shadcn/ui.  
   - Implement global layout, admin layout, and placeholder routes.

2. **Phase 2**: Core Dashboard  
   - Build out the main dashboard with dynamic cards and placeholder charts.  
   - Prepare a sample of how to fetch data from the backend (mock or real).

3. **Phase 3**: SB Management CRUD  
   - Countries, branches, roles, staff.  
   - Each with listing pages, create/edit pages, integrated with your API layer.

4. **Phase 4**: Websites & Microsites Config  
   - Base template, microsites linking to branches, etc.  
   - Manage components (menu items, testimonials, etc.).

5. **Phase 5**: Optimization & SEO  
   - WhatsApp links table, base SEO config, placeholders for pagewise/countrywise SEO.

6. **Phase 6**: Testing, Performance & Deployment  
   - Unit & integration tests.  
   - Performance checks (bundle size, images).  
   - Deploy to staging/production.

---

## 7. Conclusion

This **technical report** provides:

- A **file structure** that is scalable for future features.  
- **Boilerplate code** for quick setup (layouts, CRUD, placeholders).  
- A **phase-by-phase** plan to gradually implement all admin functionalities and integrate with an external backend later.  

