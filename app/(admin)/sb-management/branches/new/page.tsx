'use client'

import { useRouter } from 'next/navigation'
import { BranchForm } from '@/components/admin/branches/branch-form'
import { useBranches } from '@/hooks/useBranches'
import { useCountries } from '@/hooks/useCountries'
import { CreateBranchInput } from '@/services/branches.service'

export default function NewBranchPage() {
  const router = useRouter()
  const { createBranch, isCreating } = useBranches()
  const { countries } = useCountries()

  const handleSubmit = async (data: CreateBranchInput) => {
    await createBranch(data)
    router.push('/admin/sb-management/branches')
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Branch</h1>
      <div className="max-w-2xl">
        <BranchForm
          onSubmit={handleSubmit}
          countries={countries}
          isLoading={isCreating}
        />
      </div>
    </div>
  )
} 