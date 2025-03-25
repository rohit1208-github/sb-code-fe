"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMenu } from "@/hooks/useMenu";
import type { MenuItem } from "@/types/api";
import { toast } from "@/components/ui/use-toast";
import { useMicrosites } from "@/hooks/useMicrosites";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Popover } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandItem } from "@/components/ui/command";
import { CommandEmpty, CommandGroup } from "@/components/ui/command";
import { CommandList } from "@/components/ui/command";
import { CommandInput } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
// Form schema - will be moved to separate file when implementing API
const menuItemSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string(),
  price: z.string().min(1, "Price is required"),
  currency: z.string().default("USD"),
  is_active: z.boolean().default(true),
  microsites: z.array(z.number()),
});

type MenuItemFormValues = z.infer<typeof menuItemSchema>;

interface MenuDialogProps {
  mode: "add" | "edit";
  menuItem?: MenuItem;
  trigger?: React.ReactNode;
}

export function MenuDialog({ mode, menuItem, trigger }: MenuDialogProps) {
  const [open, setOpen] = useState(false);
  const { createMenuItem, updateMenuItem, isCreating, isUpdating } = useMenu();

  const { microsites } = useMicrosites();

  // Form setup with validation
  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues:
      mode === "edit" && menuItem
        ? {
            name: menuItem.name,
            description: menuItem.description,
            price: menuItem.price,
            currency: menuItem.currency,
            is_active: menuItem.is_active,
            microsites: menuItem.microsites || [],
          }
        : {
            name: "",
            description: "",
            price: "",
            currency: "USD",
            is_active: true,
            microsites: [],
          },
  });

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

  // Form submission handler - will be updated with API integration
  const onSubmit = async (data: MenuItemFormValues) => {
    try {
      console.log("MenuDialog: Submitting form data:", data);

      if (mode === "add") {
        await createMenuItem(data);
        console.log("MenuDialog: Successfully created menu item");
        toast({
          title: "Success",
          description: "Menu item created successfully",
        });
      } else if (menuItem) {
        await updateMenuItem({ id: menuItem.id, ...data });
        console.log("MenuDialog: Successfully updated menu item");
        toast({
          title: "Success",
          description: "Menu item updated successfully",
        });
      }

      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("MenuDialog: Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save menu item. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={mode === "add" ? "success" : "outline"}>
            {mode === "add" ? "Add Menu Item" : "Edit Menu Item"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Menu Item" : "Edit Menu Item"}
          </DialogTitle>
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
                    <Input placeholder="Enter menu item name" {...field} />
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
                      placeholder="Enter menu item description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter currency (e.g., USD)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Enter price"
                      {...field}
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
                            {microsites?.map((microsite) => {
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
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant={mode === "add" ? "success" : "default"}
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating
                  ? "Loading..."
                  : mode === "add"
                  ? "Add Item"
                  : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
