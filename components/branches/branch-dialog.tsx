"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { useBranches } from "@/hooks/useBranches"
import { useCountries } from "@/hooks/useCountries"
import type { Branch } from "@/types/api"

const branchFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  country: z.number().int().positive("Please select a country"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  phone: z.string().min(5, "Phone must be at least 5 characters"),
  email: z.string().email("Invalid email address"),
  is_active: z.boolean(),
  has_online_ordering: z.boolean(),
})

type BranchFormValues = z.infer<typeof branchFormSchema>

const defaultValues: BranchFormValues = {
  name: "",
  country: 0,
  address: "",
  phone: "",
  email: "",
  is_active: true,
  has_online_ordering: false,
}

interface BranchDialogProps {
  mode: "add" | "edit"
  branch?: Branch
  trigger?: React.ReactNode
}

export function BranchDialog({ mode, branch, trigger }: BranchDialogProps) {
  const [open, setOpen] = useState(false)
  const { createBranch, updateBranch } = useBranches()
  const { countries, isLoading: isLoadingCountries } = useCountries()

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: mode === "edit" && branch
      ? {
          name: branch.name,
          country: branch.country,
          address: branch.address,
          phone: branch.phone,
          email: branch.email,
          is_active: branch.is_active,
          has_online_ordering: branch.has_online_ordering,
        }
      : defaultValues,
  })

  useEffect(() => {
    if (mode === "edit" && branch) {
      form.reset({
        name: branch.name,
        country: branch.country,
        address: branch.address,
        phone: branch.phone,
        email: branch.email,
        is_active: branch.is_active,
        has_online_ordering: branch.has_online_ordering,
      })
    }
  }, [branch, mode, form])

  async function onSubmit(data: BranchFormValues) {
    try {
      // Ensure country is a number
      const formattedData = {
        ...data,
        country: Number(data.country),
      }

      console.log(`${mode === "edit" ? "Updating" : "Creating"} branch with data:`, formattedData)
      
      if (mode === "edit" && branch) {
        await updateBranch({ id: branch.id, ...formattedData })
        toast.success("Branch updated successfully")
      } else {
        await createBranch(formattedData)
        toast.success("Branch created successfully")
      }
      
      setOpen(false)
      form.reset(defaultValues)
    } catch (error: any) {
      console.error("Branch form submission error:", {
        error,
        response: error.response?.data,
        status: error.response?.status
      })

      // Handle validation errors from the backend
      if (error.response?.status === 400 && error.response?.data) {
        const backendErrors = error.response.data
        Object.keys(backendErrors).forEach(field => {
          form.setError(field as keyof BranchFormValues, {
            type: 'manual',
            message: Array.isArray(backendErrors[field]) 
              ? backendErrors[field][0] 
              : backendErrors[field]
          })
        })
      }

      toast.error(
        error.response?.data?.detail || 
        error.response?.data?.message ||
        error.message || 
        `Failed to ${mode} branch`
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit" : "Add"} Branch</DialogTitle>
          <DialogDescription>
            {mode === "edit" ? "Update the branch details below." : "Add a new branch with the form below."}
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select
                    disabled={isLoadingCountries}
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? field.value.toString() : undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem
                          key={country.id}
                          value={country.id.toString()}
                        >
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
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
              name="email"
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
            <FormField
              control={form.control}
              name="has_online_ordering"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Online Ordering</FormLabel>
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
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}