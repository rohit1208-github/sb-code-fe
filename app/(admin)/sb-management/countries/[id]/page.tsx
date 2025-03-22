'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useCountries } from '@/hooks/useCountries'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useToast } from '@/components/ui/use-toast'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  code: z.string().min(2, 'Code must be at least 2 characters').max(3, 'Code must be at most 3 characters'),
  isActive: z.boolean().default(true),
})

type FormValues = z.infer<typeof formSchema>

export default function CountryFormPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const { toast } = useToast()
  const isNew = params.id === 'new'

  const {
    countries,
    isLoading,
    error,
    createCountry,
    updateCountry,
    isCreating,
    isUpdating,
  } = useCountries()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      code: '',
      isActive: true,
    },
  })

  useEffect(() => {
    if (!isNew && countries) {
      const country = countries.find((c) => c.id === Number(params.id))
      if (country) {
        form.reset({
          name: country.name,
          code: country.code,
          isActive: country.isActive,
        })
      }
    }
  }, [isNew, countries, params.id, form])

  const onSubmit = async (data: FormValues) => {
    try {
      if (isNew) {
        await createCountry(data)
        toast({
          title: 'Success',
          description: 'Country created successfully',
        })
      } else {
        await updateCountry({ id: Number(params.id), ...data })
        toast({
          title: 'Success',
          description: 'Country updated successfully',
        })
      }
      router.push('/admin/sb-management/countries')
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save country',
      })
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{isNew ? 'Add Country' : 'Edit Country'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            Loading...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error.message || 'Failed to load country'}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isNew ? 'Add Country' : 'Edit Country'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter country name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter country code"
                      maxLength={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Active</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/sb-management/countries')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
              >
                {isNew ? 'Create' : 'Update'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 