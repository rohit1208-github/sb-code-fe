import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BranchesService, Branch, CreateBranchInput, UpdateBranchInput } from '@/services/branches.service'
import { toast } from 'sonner'

export function useBranches() {
  const queryClient = useQueryClient()

  const branches = useQuery({
    queryKey: ['branches'],
    queryFn: () => BranchesService.list()
  })

  const createBranch = useMutation({
    mutationFn: (data: CreateBranchInput) => BranchesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] })
      toast.success('Branch created successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to create branch: ${error.message}`)
    }
  })

  const updateBranch = useMutation({
    mutationFn: (data: UpdateBranchInput) => BranchesService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] })
      toast.success('Branch updated successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update branch: ${error.message}`)
    }
  })

  const deleteBranch = useMutation({
    mutationFn: (id: string) => BranchesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] })
      toast.success('Branch deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete branch: ${error.message}`)
    }
  })

  return {
    branches: branches.data ?? [],
    isLoading: branches.isLoading,
    isError: branches.isError,
    error: branches.error,
    createBranch: createBranch.mutate,
    updateBranch: updateBranch.mutate,
    deleteBranch: deleteBranch.mutate,
    isCreating: createBranch.isPending,
    isUpdating: updateBranch.isPending,
    isDeleting: deleteBranch.isPending
  }
} 