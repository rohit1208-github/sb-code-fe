'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { Role } from '@/types/roles'
import { AVAILABLE_PERMISSIONS } from '@/constants/permissions'

interface PermissionMatrixProps {
  role: Role
  onClose: () => void
}

export function PermissionMatrix({ role, onClose }: PermissionMatrixProps) {
  const { toast } = useToast()
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    role.permissions
  )

  const handlePermissionChange = (permission: string) => {
    setSelectedPermissions((current) =>
      current.includes(permission)
        ? current.filter((p) => p !== permission)
        : [...current, permission]
    )
  }

  const handleSave = async () => {
    try {
      // API call to update role permissions will go here
      toast({
        title: 'Permissions updated',
        description: 'Role permissions have been updated successfully.',
      })
      onClose()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update permissions. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Permissions - {role.name}</DialogTitle>
          <DialogDescription>
            Select the permissions for this role. Changes will be applied immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {Object.entries(AVAILABLE_PERMISSIONS).map(([category, permissions]) => (
            <div key={category} className="space-y-2">
              <h3 className="font-medium capitalize">{category}</h3>
              <div className="grid grid-cols-2 gap-4">
                {permissions.map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Checkbox
                      id={permission}
                      checked={selectedPermissions.includes(permission)}
                      onCheckedChange={() => handlePermissionChange(permission)}
                    />
                    <label
                      htmlFor={permission}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {permission}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 