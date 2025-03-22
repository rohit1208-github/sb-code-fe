export const AVAILABLE_PERMISSIONS = {
  'user-management': [
    'create:user',
    'read:user',
    'update:user',
    'delete:user',
  ],
  'branch-management': [
    'create:branch',
    'read:branch',
    'update:branch',
    'delete:branch',
  ],
  'menu-management': [
    'create:menu',
    'read:menu',
    'update:menu',
    'delete:menu',
  ],
  'order-management': [
    'create:order',
    'read:order',
    'update:order',
    'delete:order',
  ],
} as const

export type PermissionCategory = keyof typeof AVAILABLE_PERMISSIONS
export type Permission = typeof AVAILABLE_PERMISSIONS[PermissionCategory][number] 