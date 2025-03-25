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
import { useEffect } from "react";
const formSchema = z.object({
  name: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  url: z.string().min(1, "URL is required"),
  is_active: z.boolean().default(true),
  microsites: z.array(z.string()),
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
      url: initialData?.url || "",
      is_active: initialData?.is_active || true,
      microsites: initialData?.microsites || [],
    },
  });

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
