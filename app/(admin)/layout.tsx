"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "w-full justify-start",
        isActive && "bg-accent text-accent-foreground"
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen">
      {/* Mobile Navigation Trigger */}
      <Sheet>
        <SheetTrigger asChild className="lg:hidden fixed left-4 top-4 z-50">
          <Button variant="outline" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <nav className="flex h-full flex-col gap-4 p-4">
            <NavigationContent />
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-[280px] flex-col border-r bg-card">
        <nav className="flex-1 space-y-4 p-4">
          <NavigationContent />
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container py-6">
          {children}
        </div>
      </main>
    </div>
  )
}

function NavigationContent() {
  return (
    <>
      {/* Dashboard */}
      <div>
        <NavLink href="/dashboard">Dashboard</NavLink>
      </div>

      {/* SB Management Section */}
      <div className="space-y-1">
        <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
          SB Management
        </h3>
        <div className="space-y-1">
          <NavLink href="/sb-management/countries">Countries</NavLink>
          <NavLink href="/sb-management/branches">Branches</NavLink>
          <NavLink href="/sb-management/roles">Roles</NavLink>
          <NavLink href="/sb-management/staff">Staff</NavLink>
        </div>
      </div>

      {/* Websites Section */}
      <div className="space-y-1">
        <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
          Websites
        </h3>
        <div className="space-y-1">
          <NavLink href="/websites/base-template">Base Template</NavLink>
          <NavLink href="/websites/microsites-config">Microsites Config</NavLink>
        </div>
      </div>

      {/* Components Section */}
      <div className="space-y-1">
        <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
          Components
        </h3>
        <div className="space-y-1">
          <NavLink href="/manage-components/menu">Menu</NavLink>
          <NavLink href="/manage-components/testimonials">Testimonials</NavLink>
          <NavLink href="/manage-components/language-switcher">Language Switcher</NavLink>
          <NavLink href="/manage-components/food-delivery-embed">Food Delivery</NavLink>
          <NavLink href="/manage-components/careers">Careers</NavLink>
        </div>
      </div>

      {/* Optimization Section */}
      <div className="space-y-1">
        <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
          Optimization
        </h3>
        <div className="space-y-1">
          <NavLink href="/optimization/whatsapp-links">WhatsApp Links</NavLink>
          <NavLink href="/optimization/seo">SEO Settings</NavLink>
        </div>
      </div>
    </>
  )
}