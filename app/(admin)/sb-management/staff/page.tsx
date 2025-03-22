'use client'

import { useState } from 'react'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlusIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/ui/page-header'

interface StaffMember {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  lastActive: string
}

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        row.original.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {row.original.status}
      </span>
    ),
  },
  {
    accessorKey: 'lastActive',
    header: 'Last Active',
  },
]

// Temporary mock data - will be replaced with API call
const mockData: StaffMember[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'active',
    lastActive: '2024-03-22',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Manager',
    status: 'active',
    lastActive: '2024-03-21',
  },
]

export default function StaffPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = mockData.filter(staff => 
    staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Staff Management"
        description="Manage your staff members and their roles."
      />

      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Search staff..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button
          onClick={() => router.push('/sb-management/staff/new')}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Staff Member
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        onRowClick={(row) => router.push(`/sb-management/staff/${row.id}`)}
      />
    </div>
  )
} 