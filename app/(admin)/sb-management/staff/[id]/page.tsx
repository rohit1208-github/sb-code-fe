'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageHeader } from '@/components/ui/page-header'
import { toast } from 'sonner'

const staffFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(1, 'Please select a role'),
  status: z.enum(['active', 'inactive']),
})

type StaffFormValues = z.infer<typeof staffFormSchema>

const defaultValues: Partial<StaffFormValues> = {
  status: 'active',
}

interface StaffFormPageProps {
  params: {
    id: string
  }
}

export default function StaffFormPage({ params }: StaffFormPageProps) {
  const router = useRouter()
  const isNew = params.id === 'new'
  const [loading, setLoading] = useState(!isNew)

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues,
  })

  useEffect(() => {
    if (!isNew) {
      // TODO: Fetch staff member data
      // For now using mock data
      const mockStaff = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
        status: 'active' as const,
      }
      form.reset(mockStaff)
      setLoading(false)
    }
  }, [isNew, form])

  async function onSubmit(data: StaffFormValues) {
    try {
      // TODO: Implement API call
      console.log(data)
      toast.success(isNew ? 'Staff member created' : 'Staff member updated')
      router.push('/sb-management/staff')
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title={isNew ? 'Add Staff Member' : 'Edit Staff Member'}
        description={isNew ? 'Create a new staff member' : 'Edit existing staff member'}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button type="submit">
              {isNew ? 'Create Staff Member' : 'Update Staff Member'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/sb-management/staff')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
} 