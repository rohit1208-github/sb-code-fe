"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { StaffService } from '@/services/staff.service'
import { toast } from 'sonner'
import type { StaffMember } from "@/types/staff"

export function useStaff() {
  const queryClient = useQueryClient()
  const QUERY_KEY = ["staff"]

  const { data: staff = [], isLoading, refetch } = useQuery<StaffMember[]>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const response = await StaffService.getStaffMembers()
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: StaffService.createStaffMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StaffMember> }) => 
      StaffService.updateStaffMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: StaffService.deleteStaffMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })

  return {
    staff,
    isLoading,
    createStaffMember: createMutation.mutateAsync,
    updateStaffMember: updateMutation.mutateAsync,
    deleteStaffMember: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refetch
  }
} 