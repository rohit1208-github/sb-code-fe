'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { DeliveryProvider, DeliveryConfigFormData } from '../types'

const formSchema = z.object({
  provider: z.enum(['talabat', 'deliveroo', 'uber-eats', 'careem'] as const),
  branchId: z.string().min(1, 'Branch is required'),
  embedCode: z.string().min(1, 'Embed code is required'),
})

interface DeliveryConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: DeliveryConfigFormData
}

export function DeliveryConfigDialog({
  open,
  onOpenChange,
  initialData,
}: DeliveryConfigDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<DeliveryConfigFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      provider: 'talabat',
      branchId: '',
      embedCode: '',
    },
  })

  const onSubmit = async (data: DeliveryConfigFormData) => {
    try {
      setIsSubmitting(true)
      // TODO: Implement API call here
      console.log('Form data:', data)
      onOpenChange(false)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Delivery Configuration' : 'Add Delivery Configuration'}
          </DialogTitle>
          <DialogDescription>
            Configure food delivery service integration for a branch
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Provider</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="talabat">Talabat</SelectItem>
                      <SelectItem value="deliveroo">Deliveroo</SelectItem>
                      <SelectItem value="uber-eats">Uber Eats</SelectItem>
                      <SelectItem value="careem">Careem</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="branchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a branch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="branch-1">Downtown Branch</SelectItem>
                      <SelectItem value="branch-2">Marina Branch</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="embedCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Embed Code</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste the embed code here"
                      className="h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 