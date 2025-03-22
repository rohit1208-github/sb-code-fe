import { RoleForm } from '@/components/admin/roles/RoleForm'

export const metadata = {
  title: 'Create Role',
  description: 'Create a new role with permissions',
}

export default function CreateRolePage() {
  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create Role</h1>
        <p className="text-muted-foreground">
          Create a new role and assign permissions
        </p>
      </div>
      <RoleForm />
    </div>
  )
} 