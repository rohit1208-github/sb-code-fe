import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/10">
        <div className="flex h-16 items-center border-b px-6">
          <h2 className="text-lg font-semibold">SB Admin</h2>
        </div>
        <nav className="space-y-1 p-4">
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          
          {/* SB Management Section */}
          <div className="pt-4">
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
              SB Management
            </h3>
            <div className="space-y-1">
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/sb-management/countries">Countries</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/sb-management/branches">Branches</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/sb-management/roles">Roles</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/sb-management/staff">Staff</Link>
              </Button>
            </div>
          </div>

          {/* Websites Section */}
          <div className="pt-4">
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
              Websites
            </h3>
            <div className="space-y-1">
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/websites/base-template">Base Template</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/websites/microsites-config">Microsites Config</Link>
              </Button>
            </div>
          </div>

          {/* Components Section */}
          <div className="pt-4">
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
              Components
            </h3>
            <div className="space-y-1">
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/manage-components/menu">Menu</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/manage-components/testimonials">Testimonials</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/manage-components/language-switcher">Language Switcher</Link>
              </Button>
            </div>
          </div>

          {/* Optimization Section */}
          <div className="pt-4">
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
              Optimization
            </h3>
            <div className="space-y-1">
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/optimization/whatsapp-links">WhatsApp Links</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/optimization/seo">SEO</Link>
              </Button>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="border-b">
          <div className="flex h-16 items-center px-6">
            {/* Top navigation bar content */}
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
} 