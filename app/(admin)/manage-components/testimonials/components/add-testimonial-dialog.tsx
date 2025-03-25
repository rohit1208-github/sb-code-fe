"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useTestimonials } from "@/hooks/useTestimonials";
import { BranchSelect } from "@/app/(admin)/websites/microsites-config/components/branch-select";
import { useBranches } from "@/hooks/useBranches";
import { CommandGroup } from "@/components/ui/command";
import { CommandList } from "@/components/ui/command";
import { Command } from "@/components/ui/command";
import { CommandInput } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import React from "react";
import { useMicrosites } from "@/hooks/useMicrosites";

const testimonialFormSchema = z.object({
  name: z.string().min(2, "Customer name must be at least 2 characters"),

  branch: z.number(),
  link: z.string(),
  rating: z.string(),
  is_active: z.boolean(),

  content: z.string().min(10, "Comment must be at least 10 characters"),
  microsites: z.array(z.number()),
});

type TestimonialFormValues = z.infer<typeof testimonialFormSchema>;

const defaultValues: Partial<TestimonialFormValues> = {
  is_active: true,
  link: "",
  rating: "",
  microsites: [],
  branch: 0,
  name: "",
  content: "",
};

interface AddTestimonialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTestimonialDialog({
  open,
  onOpenChange,
}: AddTestimonialDialogProps) {
  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues,
  });

  const { createTestimonial, isCreating } = useTestimonials();

  const { branches, isLoading: isLoadingBranches } = useBranches();
  const { microsites, isLoading: isLoadingMicrosites } = useMicrosites();

  async function onSubmit(data: TestimonialFormValues) {
    try {
      await createTestimonial({
        name: data.name,
        content: data.content,
        branch: data.branch,
        rating: parseInt(data.rating),
        link: data.link,
        is_active: data.is_active,
        microsites: data.microsites || [],
      });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error submitting testimonial:", error);
    }
  }

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Testimonial</DialogTitle>
        </DialogHeader>
        {isLoadingBranches || isLoadingMicrosites ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Customer's feedback..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.google.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
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
                    <FormControl>
                      <BranchSelect
                        branches={branches || []}
                        multiple={false}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
                            {field.value && field.value.length > 0 ? (
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
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
