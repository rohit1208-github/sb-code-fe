"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CareerPosting } from "@/app/(admin)/manage-components/careers/types";
import { CareersService } from "@/services/careers.service";

export function useCareerPostings() {
  const queryClient = useQueryClient();
  const QUERY_KEY = ["careers"];

  const {
    data: careerPostings = [],
    isLoading,
    refetch,
  } = useQuery<CareerPosting[]>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const response = await CareersService.getCareerPostings();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: CareersService.createCareerPosting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CareerPosting> }) =>
      CareersService.updateCareerPosting(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: CareersService.deleteCareerPosting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  return {
    careerPostings,
    isLoading,
    createCareerPosting: createMutation.mutateAsync,
    updateCareerPosting: updateMutation.mutateAsync,
    deleteCareerPosting: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refetch,
  };
}
