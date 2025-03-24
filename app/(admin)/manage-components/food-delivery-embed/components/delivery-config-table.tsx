'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DeliveryConfig, DeliveryStatus } from '../types'

// Mock data - will be replaced with API data later
const mockData: DeliveryConfig[] = [
  {
    id: '1',
    provider: 'talabat',
    branchId: 'branch-1',
    branchName: 'Downtown Branch',
    embedCode: '<iframe src="https://talabat.com/embed/123" />',
    status: 'active',
    lastUpdated: '2024-03-22',
    createdAt: '2024-03-20',
  },
  {
    id: '2',
    provider: 'deliveroo',
    branchId: 'branch-2',
    branchName: 'Marina Branch',
    embedCode: '<iframe src="https://deliveroo.com/embed/456" />',
    status: 'inactive',
    lastUpdated: '2024-03-21',
    createdAt: '2024-03-19',
  },
]

const getStatusColor = (status: DeliveryStatus) => {
  switch (status) {
    case 'active':
      return 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
    case 'inactive':
      return 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
    default:
      return ''
  }
}

export function DeliveryConfigTable() {
  const [configs] = useState<DeliveryConfig[]>(mockData)

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Branch</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {configs.map((config) => (
            <TableRow key={config.id}>
              <TableCell className="font-medium">{config.branchName}</TableCell>
              <TableCell className="capitalize">{config.provider}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={getStatusColor(config.status)}>
                  {config.status}
                </Badge>
              </TableCell>
              <TableCell>{config.lastUpdated}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 