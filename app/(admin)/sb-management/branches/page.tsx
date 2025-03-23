'use client'

import { BranchesTable } from "@/components/branches/branches-table"
import { useBranches } from "@/hooks/useBranches"

export default function BranchesPage() {
  const { branches = [], isLoading } = useBranches()

  return (
    <div className="space-y-4 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Branches</h1>
        <p className="text-muted-foreground">
          Manage your restaurant branches here
        </p>
      </div>

      <BranchesTable branches={branches} isLoading={isLoading} />
    </div>
  )
} 