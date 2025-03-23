import { Suspense } from 'react'
import { MicrositesList } from './components/microsites-list'
import { PageHeader } from '@/components/ui/page-header'

export default function MicrositesPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Microsites"
        description="Manage your microsites and their configurations."
      />
      
      <Suspense fallback={<div>Loading...</div>}>
        <MicrositesList />
      </Suspense>
    </div>
  )
} 