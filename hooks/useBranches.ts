"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BranchesService, type CreateBranchDto, type UpdateBranchDto } from '@/services/branches.service'
import { toast } from 'sonner'
import type { Branch } from "@/types/api"

export function useBranches() {
  const queryClient = useQueryClient()
  const QUERY_KEY = ["branches"]

  const { data: branches = [], isLoading } = useQuery<Branch[]>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const response = await BranchesService.getAll()
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: BranchesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })

  const updateMutation = useMutation({
    mutationFn: BranchesService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: BranchesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })

  return {
    branches,
    isLoading,
    createBranch: createMutation.mutateAsync,
    updateBranch: updateMutation.mutateAsync,
    deleteBranch: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  }
} 