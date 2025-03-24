'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMenu } from '@/hooks/useMenu'
import type { MenuItem } from '@/types/api'
import { toast } from '@/components/ui/use-toast'

// Form schema - will be moved to separate file when implementing API
const menuItemSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.string().min(1, 'Price is required'),
  currency: z.string().default('USD'),
  is_active: z.boolean().default(true),
  microsite: z.number().default(0)
})

type MenuItemFormValues = z.infer<typeof menuItemSchema>

interface MenuDialogProps {
  mode: 'add' | 'edit'
  menuItem?: MenuItem
  trigger?: React.ReactNode
}

export function MenuDialog({ mode, menuItem, trigger }: MenuDialogProps) {
  const [open, setOpen] = useState(false)
  const { createMenuItem, updateMenuItem, isCreating, isUpdating } = useMenu()

  // Form setup with validation
  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: mode === 'edit' && menuItem
      ? {
          name: menuItem.name,
          description: menuItem.description,
          price: menuItem.price,
          currency: menuItem.currency,
          is_active: menuItem.is_active,
          microsite: menuItem.microsites[0] || 0
        }
      : {
          name: '',
          description: '',
          price: '',
          currency: 'USD',
          is_active: true,
          microsite: 0
        },
  })

  // Form submission handler - will be updated with API integration
  const onSubmit = async (data: MenuItemFormValues) => {
    try {
      console.log('MenuDialog: Submitting form data:', data)
      
      if (mode === 'add') {
        await createMenuItem(data)
        console.log('MenuDialog: Successfully created menu item')
        toast({
          title: 'Success',
          description: 'Menu item created successfully',
        })
      } else if (menuItem) {
        await updateMenuItem({ id: menuItem.id, ...data })
        console.log('MenuDialog: Successfully updated menu item')
        toast({
          title: 'Success',
          description: 'Menu item updated successfully',
        })
      }
      
      setOpen(false)
      form.reset()
    } catch (error) {
      console.error('MenuDialog: Error submitting form:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save menu item. Please try again.',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={mode === 'add' ? 'success' : 'outline'}>
            {mode === 'add' ? 'Add Menu Item' : 'Edit Menu Item'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add New Menu Item' : 'Edit Menu Item'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter menu item name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter menu item description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Enter price"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter currency (e.g., USD)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="microsite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Microsite ID</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter microsite ID"
                      {...field}
                      value={0}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant={mode === 'add' ? 'success' : 'default'}
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating ? (
                  'Loading...'
                ) : mode === 'add' ? (
                  'Add Item'
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 