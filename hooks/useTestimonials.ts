"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Testimonial } from "@/app/(admin)/manage-components/testimonials/components/columns";
import { TestimonialService } from "@/services/testimonial.service";

export function useTestimonials() {
  const queryClient = useQueryClient();
  const QUERY_KEY = ["testimonials"];

  const {
    data: testimonials = [],
    isLoading,
    refetch,
  } = useQuery<Testimonial[]>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const response = await TestimonialService.getAll();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: TestimonialService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Testimonial> }) =>
      TestimonialService.update({ id, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: TestimonialService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  return {
    testimonials,
    isLoading,
    createTestimonial: createMutation.mutateAsync,
    updateTestimonial: updateMutation.mutateAsync,
    deleteTestimonial: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refetch,
  };
}
