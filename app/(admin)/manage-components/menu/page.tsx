'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { MenuDialog } from './components/menu-dialog'
import { useMenu } from '@/hooks/useMenu'
import type { MenuItem } from '@/types/api'
import { Skeleton } from '@/components/ui/skeleton'
import { PencilIcon, TrashIcon, PlusCircleIcon } from "@heroicons/react/24/outline"

export default function MenuPage() {
  const { menuItems, isLoading, deleteMenuItem, isDeleting } = useMenu()

  const handleDelete = async (id: number) => {
    try {
      await deleteMenuItem(id)
    } catch (error) {
      console.error('Failed to delete menu item:', error)
    }
  }

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Menu Management
              </CardTitle>
              <CardDescription className="mt-2">
                Manage your restaurant's menu items, prices, and availability
              </CardDescription>
            </div>
            <MenuDialog
              mode="add"
              trigger={
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  <PlusCircleIcon className="h-5 w-5 mr-2" />
                  Add Menu Item
                </Button>
              }
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Description</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Price</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Currency</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="hover:bg-muted/50 transition-colors">
                      <td className="p-4 text-sm font-medium text-gray-900">
                        <Skeleton className="h-4 w-[100px]" />
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <Skeleton className="h-4 w-[200px]" />
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <Skeleton className="h-4 w-[80px]" />
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <Skeleton className="h-4 w-[60px]" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-4 w-[60px]" />
                      </td>
                      <td className="p-4 text-right">
                        <Skeleton className="h-4 w-[100px]" />
                      </td>
                    </tr>
                  ))
                ) : menuItems?.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="p-4 text-sm text-gray-600">{item.description}</td>
                    <td className="p-4 text-sm text-gray-600">{item.price}</td>
                    <td className="p-4 text-sm text-gray-600">{item.currency_display}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          item.is_active
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                            : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                        }`}
                      >
                        {item.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <MenuDialog
                          mode="edit"
                          menuItem={item}
                          trigger={
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <PencilIcon className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          }
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-gray-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(item.id)}
                          disabled={isDeleting}
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 