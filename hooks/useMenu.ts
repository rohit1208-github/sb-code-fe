'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MenuService } from '@/services/menu.service'
import { toast } from '@/components/ui/use-toast'
import type { CreateMenuItemDto, UpdateMenuItemDto } from '@/types/api'

export function useMenu() {
  const queryClient = useQueryClient()
  const QUERY_KEY = ['menu-items']

  const { data: menuItems, isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      console.log('useMenu: Fetching menu items')
      const data = await MenuService.getAll()
      console.log('useMenu: Successfully fetched menu items:', data)
      return data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: CreateMenuItemDto) => {
      console.log('useMenu: Creating menu item:', data)
      return await MenuService.create(data)
    },
    onSuccess: (data) => {
      console.log('useMenu: Successfully created menu item:', data)
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast({
        title: 'Success',
        description: 'Menu item created successfully',
      })
    },
    onError: (error: Error) => {
      console.error('useMenu: Error creating menu item:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create menu item. Please try again.',
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateMenuItemDto) => {
      console.log('useMenu: Updating menu item:', data)
      return await MenuService.update(data)
    },
    onSuccess: (data) => {
      console.log('useMenu: Successfully updated menu item:', data)
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast({
        title: 'Success',
        description: 'Menu item updated successfully',
      })
    },
    onError: (error: Error) => {
      console.error('useMenu: Error updating menu item:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update menu item. Please try again.',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      console.log('useMenu: Deleting menu item:', id)
      return await MenuService.delete(id)
    },
    onSuccess: (_, id) => {
      console.log('useMenu: Successfully deleted menu item:', id)
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast({
        title: 'Success',
        description: 'Menu item deleted successfully',
      })
    },
    onError: (error: Error) => {
      console.error('useMenu: Error deleting menu item:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete menu item. Please try again.',
      })
    },
  })

  return {
    menuItems,
    isLoading,
    createMenuItem: createMutation.mutateAsync,
    updateMenuItem: updateMutation.mutateAsync,
    deleteMenuItem: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
} 