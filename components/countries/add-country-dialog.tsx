import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useCountries } from '@/hooks/useCountries'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'
import type { Country } from '@/services/countries.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const countryFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  code: z.string().min(1, 'Code is required'),
  is_active: z.boolean().default(true),
})

type CountryFormValues = z.infer<typeof countryFormSchema>

const defaultValues: CountryFormValues = {
  name: '',
  code: '',
  is_active: true,
}

interface CountryDialogProps {
  mode: 'add' | 'edit'
  country?: Country
  trigger?: React.ReactNode
}

export function CountryDialog({ mode, country, trigger }: CountryDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()
  const { createCountry, updateCountry, isCreating, isUpdating } = useCountries()

  const form = useForm<CountryFormValues>({
    resolver: zodResolver(countryFormSchema),
    defaultValues: mode === 'edit' && country 
      ? {
          name: country.name,
          code: country.code,
          is_active: country.is_active,
        }
      : defaultValues,
  })

  useEffect(() => {
    if (mode === 'edit' && country) {
      form.reset({
        name: country.name,
        code: country.code,
        is_active: country.is_active,
      })
    }
  }, [country, mode, form])

  const handleSuccess = () => {
    setOpen(false)
    form.reset()
    toast({
      title: "Success",
      description: `Country ${mode === 'edit' ? 'updated' : 'added'} successfully`
    })
    router.refresh()
    queryClient.invalidateQueries({ queryKey: ['countries'] })
  }

  const handleError = (error: any) => {
    console.error('Form submission error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    })

    if (error.response?.status === 400) {
      const errorData = error.response.data
      if (typeof errorData === 'object') {
        Object.entries(errorData).forEach(([field, errors]) => {
          if (Array.isArray(errors)) {
            form.setError(field as any, {
              type: 'server',
              message: errors[0]
            })
          }
        })
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please correct the errors in the form"
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response.data?.detail || 'Invalid data submitted'
        })
      }
      return
    }

    toast({
      variant: "destructive",
      title: "Error",
      description: error.response?.data?.detail || error.message || `Failed to ${mode} country`
    })
  }

  const createMutation = useMutation({
    mutationFn: createCountry,
    onSuccess: handleSuccess,
    onError: handleError
  })

  const updateMutation = useMutation({
    mutationFn: updateCountry,
    onSuccess: handleSuccess,
    onError: handleError
  })

  async function onSubmit(formData: CountryFormValues) {
    try {
      const payload = {
        name: formData.name.trim(),
        code: String(formData.code).trim(),
        is_active: formData.is_active
      }

      console.log('Submitting data:', payload)

      if (mode === 'edit' && country) {
        await updateMutation.mutateAsync({
          id: country.id,
          ...payload
        })
      } else {
        await createMutation.mutateAsync(payload)
      }
    } catch (error) {
      // Error will be handled by mutation error handlers
      console.error('Unexpected error:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={mode === 'add' ? 'success' : 'outline'}>
            {mode === 'edit' ? 'Edit Country' : 'Add Country'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Country' : 'Add Country'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit' 
              ? 'Edit the country details below.'
              : 'Add a new country to the system.'}
          </DialogDescription>
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
                    <Input placeholder="Enter country code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
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
            <DialogFooter>
              <Button 
                type="submit" 
                variant={mode === 'add' ? 'success' : 'default'}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? (mode === 'edit' ? 'Updating...' : 'Adding...') 
                  : (mode === 'edit' ? 'Update Country' : 'Add Country')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}