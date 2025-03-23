"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useBranches } from "@/hooks/useBranches"
import type { Branch } from "@/types/api"

interface DeleteBranchDialogProps {
  branch: Branch
  trigger?: React.ReactNode
}

export function DeleteBranchDialog({ branch, trigger }: DeleteBranchDialogProps) {
  const { deleteBranch } = useBranches()

  async function handleDelete() {
    try {
      console.log(`Attempting to delete branch ${branch.id}`)
      await deleteBranch(branch.id)
      toast.success("Branch deleted successfully")
    } catch (error: any) {
      console.error("Failed to delete branch:", error)
      toast.error(error.response?.data?.detail || error.message || "Failed to delete branch")
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the branch "{branch.name}". This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Delete Branch
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 