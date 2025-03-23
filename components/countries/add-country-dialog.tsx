import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
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
import { useCountries } from '@/hooks/useCountries'
import { toast } from 'sonner'

const countryFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  code: z.string().min(1, 'Code is required'),
  is_active: z.boolean().default(true),
}).required()

type CountryFormValues = z.infer<typeof countryFormSchema>

const defaultValues: CountryFormValues = {
  name: '',
  code: '',
  is_active: true,
}

export function AddCountryDialog() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { createCountry, isCreating } = useCountries()

  const form = useForm<CountryFormValues>({
    resolver: zodResolver(countryFormSchema),
    defaultValues,
  })

  async function onSubmit(formData: CountryFormValues) {
    try {
      const payload = {
        name: formData.name.trim(),
        code: String(formData.code).trim(),
        is_active: formData.is_active
      }

      console.log('Submitting data:', payload)

      await createCountry(payload, {
        onSuccess: (response) => {
          console.log('Success response:', response?.data)
          setOpen(false)
          form.reset()
          toast.success('Country added successfully')
          router.refresh()
        },
        onError: (error: any) => {
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
              toast.error('Please correct the errors in the form')
            } else {
              toast.error(error.response.data?.detail || 'Invalid data submitted')
            }
            return
          }

          toast.error(error.response?.data?.detail || error.message || 'Failed to add country')
        },
      })
    } catch (error: any) {
      console.error('Unexpected error:', error)
      toast.error('An unexpected error occurred')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Country</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Country</DialogTitle>
          <DialogDescription>
            Add a new country to the system. Click save when you're done.
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
              <Button type="submit" disabled={isCreating}>
                {isCreating ? 'Adding...' : 'Add Country'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}