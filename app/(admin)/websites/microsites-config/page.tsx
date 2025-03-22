'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlusIcon } from '@radix-ui/react-icons'
import { DataTable } from '@/components/ui/data-table'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

interface Microsite {
  id: string
  name: string
  domain: string
  branch: string
  template: string
  status: 'published' | 'draft' | 'archived'
  lastUpdated: string
}

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'domain',
    header: 'Domain',
    cell: ({ row }) => (
      <a
        href={`https://${row.original.domain}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {row.original.domain}
      </a>
    ),
  },
  {
    accessorKey: 'branch',
    header: 'Branch',
  },
  {
    accessorKey: 'template',
    header: 'Template',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      const colorMap = {
        published: 'bg-green-100 text-green-800',
        draft: 'bg-yellow-100 text-yellow-800',
        archived: 'bg-gray-100 text-gray-800',
      }
      return (
        <Badge variant="secondary" className={colorMap[status]}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'lastUpdated',
    header: 'Last Updated',
  },
]

// Temporary mock data
const mockData: Microsite[] = [
  {
    id: '1',
    name: 'Downtown Branch',
    domain: 'downtown.restaurant.com',
    branch: 'Downtown',
    template: 'Modern Dark',
    status: 'published',
    lastUpdated: '2024-03-22',
  },
  {
    id: '2',
    name: 'Uptown Branch',
    domain: 'uptown.restaurant.com',
    branch: 'Uptown',
    template: 'Classic Light',
    status: 'draft',
    lastUpdated: '2024-03-21',
  },
]

export default function MicrositesConfigPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = mockData.filter(site => 
    site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.branch.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Microsites Configuration"
        description="Manage your branch-specific websites and their configurations."
      />

      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Search microsites..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              Add Microsite
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Microsite</DialogTitle>
              <DialogDescription>
                Configure a new website for your branch.
              </DialogDescription>
            </DialogHeader>
            {/* Add microsite creation form here */}
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                Microsite creation form will be implemented here.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        onRowClick={(row) => router.push(`/websites/microsites-config/${row.id}`)}
      />

      <div className="rounded-lg border bg-card p-6 space-y-4">
        <h3 className="font-semibold">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="w-full">
            Bulk Publish
          </Button>
          <Button variant="outline" className="w-full">
            Update Templates
          </Button>
          <Button variant="outline" className="w-full">
            Check Domain Status
          </Button>
        </div>
      </div>
    </div>
  )
} 