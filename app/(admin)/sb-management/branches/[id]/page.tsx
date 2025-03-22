'use client'

import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { BranchForm } from '@/components/admin/branches/branch-form'
import { useBranches } from '@/hooks/useBranches'
import { useCountries } from '@/hooks/useCountries'
import { BranchesService, UpdateBranchInput } from '@/services/branches.service'

export default function EditBranchPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { updateBranch, isUpdating } = useBranches()
  const { countries } = useCountries()

  const { data: branch, isLoading } = useQuery({
    queryKey: ['branch', params.id],
    queryFn: () => BranchesService.getById(params.id)
  })

  const handleSubmit = async (data: UpdateBranchInput) => {
    await updateBranch({ ...data, id: params.id })
    router.push('/admin/sb-management/branches')
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-6" />
          <div className="h-96 bg-gray-100 rounded" />
        </div>
      </div>
    )
  }

  if (!branch) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Branch not found</h1>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Branch: {branch.name}</h1>
      <div className="max-w-2xl">
        <BranchForm
          initialData={branch}
          onSubmit={handleSubmit}
          countries={countries}
          isLoading={isUpdating}
        />
      </div>
    </div>
  )
} 