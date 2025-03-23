'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { MenuDialog } from './components/menu-dialog'

// Types for menu items - will be moved to types/api.ts when implementing API integration
interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: string
  isActive: boolean
}

// Mock data - will be replaced with API call
const mockMenuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Margherita Pizza',
    description: 'Classic tomato and mozzarella',
    price: 12.99,
    category: 'Pizza',
    isActive: true,
  },
  {
    id: 2,
    name: 'Pepperoni Pizza',
    description: 'Spicy pepperoni with cheese',
    price: 14.99,
    category: 'Pizza',
    isActive: true,
  },
]

export default function MenuPage() {
  // State management - will be replaced with React Query hooks when implementing API
  const [menuItems] = useState<MenuItem[]>(mockMenuItems)

  // Handlers - will be updated with API integration
  const handleDelete = async (id: number) => {
    // API integration will be added here
    console.log('Delete item:', id)
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Menu Management</CardTitle>
          <MenuDialog mode="add" />
        </CardHeader>
        <CardContent>
          {/* Search and filter options will be added here */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menuItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          item.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <MenuDialog
                        mode="edit"
                        menuItem={item}
                        trigger={
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mr-2"
                          >
                            Edit
                          </Button>
                        }
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 