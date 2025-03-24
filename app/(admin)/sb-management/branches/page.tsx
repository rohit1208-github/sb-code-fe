'use client'

import { BranchesTable } from "@/components/branches/branches-table"
import { useBranches } from "@/hooks/useBranches"

export default function BranchesPage() {
  const { branches = [], isLoading } = useBranches()

  return (
    <div className="mt-8 p-8">
      <BranchesTable branches={branches} isLoading={isLoading} />
    </div>
  )
} 