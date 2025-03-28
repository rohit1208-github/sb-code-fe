'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { MicrositeService } from '@/services/microsite.service'
import { BranchesService } from '@/services/branches.service'
import type { CreateMicrositeDto } from '@/types/microsites'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/components/ui/use-toast'
import { BranchSelect } from './branch-select'
import React from 'react'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  branches: z.array(z.number()).min(1, 'At least one branch must be selected'),
  is_active: z.boolean().default(true),
  has_language_switcher: z.boolean().default(false),
  secondary_language: z.string().nullable(),
})

type FormData = z.infer<typeof formSchema>

export function AddMicrositeForm({ onSuccess }: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: branchesData } = useQuery({
    queryKey: ['branches'],
    queryFn: () => BranchesService.getAll(),
  })

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      branches: [],
      is_active: true,
      has_language_switcher: false,
      secondary_language: null,
    },
  })

  // Add form state debugging
  React.useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      console.log('📋 Form State Update:', {
        field: name,
        type,
        value: value[name as keyof FormData],
        allValues: value
      })
    })
    return () => subscription.unsubscribe()
  }, [form])

  const createMutation = useMutation({
    mutationFn: (data: CreateMicrositeDto) => MicrositeService.create(data),
    onSuccess: () => {
      console.log('✅ [AddMicrositeForm] Microsite created successfully')
      queryClient.invalidateQueries({ queryKey: ['microsites'] })
      toast({
        title: 'Success',
        description: 'Microsite created successfully',
      })
      form.reset()
      onSuccess?.()
    },
    onError: (error) => {
      console.error('❌ [AddMicrositeForm] Error creating microsite:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create microsite. Please try again.',
      })
    },
  })

  const onSubmit = async (data: FormData) => {
    console.log('📝 [AddMicrositeForm] Submitting form:', data)
    setIsSubmitting(true)
    try {
      // Ensure data is properly formatted
      const formattedData: CreateMicrositeDto = {
        name: data.name.trim(),
        slug: data.slug.trim(),
        branches: data.branches.map(id => Number(id)),
        is_active: Boolean(data.is_active),
        has_language_switcher: Boolean(data.has_language_switcher),
        secondary_language: data.secondary_language || null
      }
      
      console.log('🔄 [AddMicrositeForm] Formatted data:', formattedData)
      await createMutation.mutateAsync(formattedData)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter microsite name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="Enter slug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="branches"
          render={({ field: { onChange, value } }) => {
            console.log('🌳 Branch Field Render:', { value })
            return (
              <FormItem>
                <FormLabel>Branches</FormLabel>
                <FormControl>
                  <BranchSelect
                    branches={branchesData?.data || []}
                    value={value}
                    onChange={(newValue) => {
                      console.log('🔄 Branch Selection Change:', {
                        oldValue: value,
                        newValue
                      })
                      onChange(newValue)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Active Status</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="has_language_switcher"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Language Switcher</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="secondary_language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secondary Language</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter secondary language" 
                  {...field} 
                  value={field.value || ''}
                  disabled={!form.watch('has_language_switcher')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Creating...' : 'Create Microsite'}
        </Button>
      </form>
    </Form>
  )
} 