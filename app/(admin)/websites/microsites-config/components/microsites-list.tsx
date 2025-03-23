'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMicrosites } from '@/hooks/useMicrosites'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PlusIcon } from '@radix-ui/react-icons'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AddMicrositeDialog } from './add-microsite-dialog'

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
  },
  {
    accessorKey: 'branches_data',
    header: 'Branches',
    cell: ({ row }) => {
      const branches = row.original.branches_data
      return (
        <div className="space-y-1">
          {branches.map((branch) => (
            <div key={branch.id} className="text-sm">
              {branch.name} - {branch.country_name}
            </div>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: 'sections',
    header: 'Sections',
    cell: ({ row }) => {
      const sections = row.original.sections
      return (
        <div className="space-y-1">
          {sections.map((section) => (
            <Badge key={section.id} variant="secondary">
              {section.section_type_display}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.original.is_active
      return (
        <Badge variant={isActive ? 'success' : 'secondary'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Updated',
    cell: ({ row }) => {
      return new Date(row.original.updated_at).toLocaleDateString()
    },
  },
]

export function MicrositesList() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const { microsites, isLoading, error } = useMicrosites()

  console.log('🎨 [MicrositesList] Component rendering', {
    isLoading,
    hasError: !!error,
    micrositesCount: microsites?.length,
  })

  if (isLoading) {
    console.log('⌛ [MicrositesList] Loading state')
    return <div>Loading...</div>
  }
  
  if (error) {
    console.error('❌ [MicrositesList] Error state:', error)
    return <div>Error loading microsites</div>
  }
  
  if (!microsites) {
    console.log('⚠️ [MicrositesList] No data available')
    return null
  }

  const filteredData = microsites.filter(site =>
    site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  console.log('🔍 [MicrositesList] Filtered data:', {
    totalCount: microsites.length,
    filteredCount: filteredData.length,
    searchQuery: searchQuery || 'none',
  })

  const handleRowClick = (row) => {
    console.log('👆 [MicrositesList] Row clicked:', {
      id: row.id,
      name: row.name,
    })
    router.push(`/websites/microsites-config/${row.id}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Search microsites..."
          value={searchQuery}
          onChange={(e) => {
            const value = e.target.value
            console.log('🔤 [MicrositesList] Search query changed:', value)
            setSearchQuery(value)
          }}
          className="max-w-sm"
        />
        <AddMicrositeDialog />
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        onRowClick={handleRowClick}
      />

      <div className="rounded-lg border bg-card p-6 space-y-4">
        <h3 className="font-semibold">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => console.log('🔄 [MicrositesList] Bulk Activate clicked')}
          >
            Bulk Activate
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => console.log('📝 [MicrositesList] Update Sections clicked')}
          >
            Update Sections
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => console.log('🎨 [MicrositesList] Manage Templates clicked')}
          >
            Manage Templates
          </Button>
        </div>
      </div>
    </div>
  )
} 