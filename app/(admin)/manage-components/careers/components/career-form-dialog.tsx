"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CareerPosting, CareerPostingFormData } from "../types";
import { Switch } from "@/components/ui/switch";
import { useCareerPostings } from "@/hooks/useCareers";
import React, { useEffect } from "react";
import { Check } from "lucide-react";
import { CommandGroup } from "@/components/ui/command";
import { CommandList } from "@/components/ui/command";
import { Command } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CommandInput } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ChevronsUpDown } from "lucide-react";
import { useMicrosites } from "@/hooks/useMicrosites";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Select } from "@/components/ui/select";
import { BranchSelect } from "@/app/(admin)/websites/microsites-config/components/branch-select";
import { useBranches } from "@/hooks/useBranches";
const formSchema = z.object({
  name: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  department: z.string(),
  branch: z.number(),
  job_type: z.string(),
  url: z.string().min(1, "URL is required"),
  is_active: z.boolean().default(true),
  microsites: z.array(z.number()),
});

interface CareerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: CareerPosting;
}

export function CareerFormDialog({
  open,
  onOpenChange,
  initialData,
}: CareerFormDialogProps) {
  const form = useForm<CareerPostingFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      department: initialData?.department || "",
      branch: initialData?.branch || 0,
      job_type: initialData?.job_type || "full_time",
      url: initialData?.url || "",
      is_active: initialData?.is_active || true,
      microsites: initialData?.microsites || [],
    },
  });

  const { microsites } = useMicrosites();

  const { branches } = useBranches();

  const handleSelect = React.useCallback(
    (micrositeId: number) => {
      const currentValue = form.getValues("microsites");
      const newValue = currentValue.includes(micrositeId)
        ? currentValue.filter((id) => id !== micrositeId)
        : [...currentValue, micrositeId];

      form.setValue("microsites", newValue);
      console.log("newValue :", newValue);
    },
    [form]
  );

  useEffect(() => {
    form.setValue("name", initialData?.name || "");
    form.setValue("description", initialData?.description || "");
    form.setValue("url", initialData?.url || "");
    form.setValue("is_active", initialData?.is_active || true);
    form.setValue("microsites", initialData?.microsites || []);
  }, [initialData]);

  const { createCareerPosting, updateCareerPosting, isCreating, isUpdating } =
    useCareerPostings();

  const handleSubmit = async (data: CareerPostingFormData) => {
    // Transform form data to CareerPosting format
    const postingData: CareerPosting = {
      ...data,
      job_type: data.job_type,
      status: initialData?.status || "draft",
      postedDate: initialData?.postedDate || new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    if (initialData && initialData.id) {
      await updateCareerPosting({ id: initialData.id, data: postingData });
    } else {
      await createCareerPosting(postingData);
    }
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Career Posting" : "Create Career Posting"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Job title" {...field} />
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
                      placeholder="Job description"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Job URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input placeholder="Department" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="job_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        <SelectItem value="full_time">Full-Time</SelectItem>
                        <SelectItem value="part_time">Part-Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="branch"
              render={({ field: { onChange, value } }) => {
                console.log("🌳 Branch Field Render:", { value });
                return (
                  <FormItem>
                    <FormLabel>Branches</FormLabel>
                    <FormControl>
                      <BranchSelect
                        branches={branches || []}
                        multiple={false}
                        value={value}
                        onChange={(newValue) => {
                          console.log("🔄 Branch Selection Change:", {
                            oldValue: value,
                            newValue,
                          });
                          onChange(newValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="microsites"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Microsites</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full flex flex-wrap gap-2 justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value.length > 0 ? (
                            field.value.map((microsite) => (
                              <Badge key={microsite} variant="secondary">
                                {microsite}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground">
                              Select microsite
                            </span>
                          )}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search microsites..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandGroup>
                            {microsites?.map((microsite: any) => {
                              const isSelected = field.value.includes(
                                microsite.id
                              );
                              return (
                                <div
                                  key={microsite.id}
                                  className={cn(
                                    "flex items-center space-x-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground",
                                    isSelected && "bg-accent"
                                  )}
                                  onClick={() => handleSelect(microsite.id)}
                                >
                                  <Check
                                    className={cn(
                                      "h-4 w-4",
                                      isSelected ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <span>{microsite.name}</span>
                                </div>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {initialData ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
