export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateRoleInput {
  name: string
  description: string
  permissions: string[]
}

export interface UpdateRoleInput extends Partial<CreateRoleInput> {
  id: string
}

export interface RolePermission {
  category: string
  permissions: string[]
}

export type RoleWithPermissions = Role & {
  permissionDetails: RolePermission[]
} 