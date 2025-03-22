'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Branch, CreateBranchInput } from '@/services/branches.service'

const branchFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  countryId: z.string().min(1, 'Country is required'),
  address: z.string().min(1, 'Address is required'),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  operatingHours: z.array(
    z.object({
      day: z.string(),
      open: z.string(),
      close: z.string(),
    })
  ),
  contactInfo: z.object({
    phone: z.string().min(1, 'Phone is required'),
    email: z.string().email('Invalid email address'),
  }),
})

interface BranchFormProps {
  initialData?: Branch
  onSubmit: (data: CreateBranchInput) => void
  countries: { id: string; name: string }[]
  isLoading?: boolean
}

export function BranchForm({
  initialData,
  onSubmit,
  countries,
  isLoading,
}: BranchFormProps) {
  const form = useForm<z.infer<typeof branchFormSchema>>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: initialData || {
      name: '',
      countryId: '',
      address: '',
      location: { lat: 0, lng: 0 },
      operatingHours: [],
      contactInfo: {
        phone: '',
        email: '',
      },
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="countryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contactInfo.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactInfo.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Branch'}
        </Button>
      </form>
    </Form>
  )
} 