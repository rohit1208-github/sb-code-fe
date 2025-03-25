"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/ui/page-header";
import { toast } from "sonner";
import { StaffService } from "@/services/staff.service";
import { StaffRole } from "@/types/staff";
import { Branch } from "@/types/api";
import { Country } from "@/services/countries.service";
import { useBranches } from "@/hooks/useBranches";
import { useCountries } from "@/hooks/useCountries";
import { useRoles } from "@/hooks/useRoles";
const staffFormSchema = z.object({
  first_name: z.string().min(2, "Name must be at least 2 characters"),
  last_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Please select a role"),
  status: z.enum(["active", "inactive"]),
  country: z.string().min(1, "Please select a country"),
  branch: z.string().min(1, "Please select a branch"),
});

type StaffFormValues = z.infer<typeof staffFormSchema>;

const defaultValues: Partial<StaffFormValues> = {
  status: "active",
};

interface StaffFormPageProps {
  params: {
    id: string;
  };
}

export default function StaffFormPage() {
  const router = useRouter();
  const { id } = useParams();
  const isNew = id === "new";
  const [loading, setLoading] = useState(!isNew);

  const { branches, isLoading: isLoadingBranches } = useBranches();
  const { countries, isLoading: isLoadingCountries } = useCountries();
  const { data: roles, isLoading: isLoadingRoles } = useRoles();

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!isNew) {
      fetchStaffMember();
    }
    setLoading(false);
  }, [isNew, form]);

  async function fetchStaffMember() {
    const staffMember = await StaffService.getStaffMember(id as string);
    const staffMemberData = staffMember.data;

    console.log("roles :", roles);
    const selectedRole = roles?.find(
      (role) => role.id === staffMemberData.role.toString()
    );
    console.log("selectedRole :", selectedRole);

    const selectedBranch = branches.find(
      (branch) => branch.id === staffMemberData.branch
    );

    const selectedCountry = countries.find(
      (country) => country.id === staffMemberData.country
    );

    form.setValue("first_name", staffMemberData.first_name);
    form.setValue("last_name", staffMemberData.last_name);
    form.setValue("email", staffMemberData.email);
    form.setValue("role", selectedRole?.id as string);
    form.setValue("status", staffMemberData.is_active ? "active" : "inactive");
    form.setValue("country", selectedCountry?.id.toString() as string);
    form.setValue("branch", selectedBranch?.id.toString() as string);
  }

  async function onSubmit(data: StaffFormValues) {
    try {
      const roleIdNumber = parseInt(data.role);
      const branchIdNumber = parseInt(data.branch);
      const countryIdNumber = parseInt(data.country);

      if (isNew) {
        await StaffService.createStaffMember({
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          role: roleIdNumber,
          branch: branchIdNumber,
          country: countryIdNumber,
          is_active: data.status === "active" ? true : false,
          lastActive: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } else {
        await StaffService.updateStaffMember(id as string, {
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          role: roleIdNumber,
          branch: branchIdNumber,
          country: countryIdNumber,
          is_active: data.status === "active" ? true : false,
          lastActive: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      toast.success(isNew ? "Staff member created" : "Staff member updated");
      router.push("/sb-management/staff");
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title={isNew ? "Add Staff Member" : "Edit Staff Member"}
        description={
          isNew ? "Create a new staff member" : "Edit existing staff member"
        }
      />

      {isLoadingRoles ||
        isLoadingBranches ||
        (isLoadingCountries && <div>Loading...</div>)}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="first_name"
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
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
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
                  <Input
                    placeholder="john@example.com"
                    type="email"
                    {...field}
                  />
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles?.map((role: StaffRole) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
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
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingCountries ? (
                      <SelectItem value="loading">Loading...</SelectItem>
                    ) : (
                      countries.map((country: Country) => (
                        <SelectItem
                          key={country.id}
                          value={country.id.toString()}
                        >
                          {country.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="branch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a branch" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingBranches ? (
                      <SelectItem value="loading">Loading...</SelectItem>
                    ) : (
                      branches.map((branch: Branch) => (
                        <SelectItem
                          key={branch.id}
                          value={branch.id.toString()}
                        >
                          {branch.name}
                        </SelectItem>
                      ))
                    )}
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
              {isNew ? "Create Staff Member" : "Update Staff Member"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/sb-management/staff")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
