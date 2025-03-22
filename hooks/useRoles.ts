import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Role, CreateRoleInput, UpdateRoleInput } from '@/types/roles'
import { toast } from '@/hooks/use-toast'

// This would be replaced with actual API calls
const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full system access',
    permissions: ['create:user', 'read:user', 'update:user', 'delete:user'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Add more mock roles as needed
]

async function fetchRoles(): Promise<Role[]> {
  // This would be replaced with an actual API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockRoles), 1000)
  })
}

async function createRole(input: CreateRoleInput): Promise<Role> {
  // This would be replaced with an actual API call
  return new Promise((resolve) => {
    const newRole: Role = {
      id: Math.random().toString(),
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTimeout(() => resolve(newRole), 1000)
  })
}

async function updateRole(input: UpdateRoleInput): Promise<Role> {
  // This would be replaced with an actual API call
  return new Promise((resolve) => {
    const updatedRole: Role = {
      ...mockRoles[0],
      ...input,
      updatedAt: new Date().toISOString(),
    }
    setTimeout(() => resolve(updatedRole), 1000)
  })
}

async function deleteRole(id: string): Promise<void> {
  // This would be replaced with an actual API call
  return new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })
}

export function useRoles() {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['roles'],
    queryFn: fetchRoles,
  })

  const createMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      toast({
        title: 'Role created',
        description: 'The role has been created successfully.',
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create role. Please try again.',
        variant: 'destructive',
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      toast({
        title: 'Role updated',
        description: 'The role has been updated successfully.',
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update role. Please try again.',
        variant: 'destructive',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      toast({
        title: 'Role deleted',
        description: 'The role has been deleted successfully.',
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete role. Please try again.',
        variant: 'destructive',
      })
    },
  })

  return {
    data,
    isLoading,
    error,
    createRole: createMutation.mutate,
    updateRole: updateMutation.mutate,
    deleteRole: deleteMutation.mutate,
  }
} 