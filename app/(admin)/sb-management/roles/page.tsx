import { Suspense } from 'react'
import { RolesList } from '@/components/admin/roles/RolesList'
import { RolesHeader } from '@/components/admin/roles/RolesHeader'
import { LoadingRoles } from '@/components/admin/roles/LoadingRoles'

export const metadata = {
  title: 'Roles Management',
  description: 'Manage roles and permissions for staff members',
}

export default function RolesPage() {
  return (
    <div className="space-y-4 p-8">
      <RolesHeader />
      <Suspense fallback={<LoadingRoles />}>
        <RolesList />
      </Suspense>
    </div>
  )
} 