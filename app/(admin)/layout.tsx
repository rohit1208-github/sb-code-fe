"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  Menu,
  LayoutDashboard,
  Globe,
  Building2,
  Users,
  UserCog,
  Palette,
  FileCode,
  MenuSquare,
  MessageSquare,
  Languages,
  UtensilsCrossed,
  Briefcase,
  Settings,
  Link as LinkIcon,
  Search
} from 'lucide-react'

function NavLink({ href, children, icon: Icon, collapsed }: { href: string; children: React.ReactNode; icon: any; collapsed?: boolean }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "w-full justify-start gap-2 relative overflow-hidden",
        isActive && "bg-accent text-accent-foreground"
      )}
    >
      <Link 
        href={href} 
        className={cn(
          "flex items-center gap-2 transition-transform duration-300",
          collapsed ? "translate-x-[30%] group-hover:translate-x-0" : "translate-x-0"
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className={cn(
          "transition-all duration-300 overflow-hidden",
          collapsed ? "w-0 opacity-0 group-hover:w-auto group-hover:opacity-100" : "w-auto opacity-100"
        )}>
          {children}
        </span>
      </Link>
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
      <div 
        className={cn(
          "hidden lg:block border-r bg-card overflow-hidden transition-all duration-300",
          "hover:w-[280px] w-[80px] group"
        )}
      >
        <nav className="flex-1 space-y-2 p-4">
          <NavigationContent isCollapsed />
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

function NavigationContent({ isCollapsed }: { isCollapsed?: boolean }) {
  return (
    <>
      {/* Dashboard */}
      <div>
        <NavLink 
          href="/dashboard" 
          icon={LayoutDashboard} 
          collapsed={isCollapsed}
        >
          Dashboard
        </NavLink>
      </div>

      {/* SB Management Section */}
      <div className="space-y-1">
        <div className={cn(
          "transition-all duration-300 overflow-hidden",
          isCollapsed ? "h-0 opacity-0 group-hover:h-auto group-hover:opacity-100" : "h-auto opacity-100"
        )}>
          <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
            SB Management
          </h3>
        </div>
        <div className="space-y-1">
          <NavLink href="/sb-management/countries" icon={Globe} collapsed={isCollapsed}>
            Countries
          </NavLink>
          <NavLink href="/sb-management/branches" icon={Building2} collapsed={isCollapsed}>
            Branches
          </NavLink>
          <NavLink href="/sb-management/roles" icon={UserCog} collapsed={isCollapsed}>
            Roles
          </NavLink>
          <NavLink href="/sb-management/staff" icon={Users} collapsed={isCollapsed}>
            Staff
          </NavLink>
        </div>
      </div>

      {/* Websites Section */}
      <div className="space-y-1">
        <div className={cn(
          "transition-all duration-300 overflow-hidden",
          isCollapsed ? "h-0 opacity-0 group-hover:h-auto group-hover:opacity-100" : "h-auto opacity-100"
        )}>
          <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
            Websites
          </h3>
        </div>
        <div className="space-y-1">
          <NavLink href="/websites/base-template" icon={Palette} collapsed={isCollapsed}>
            Base Template
          </NavLink>
          <NavLink href="/websites/microsites-config" icon={FileCode} collapsed={isCollapsed}>
            Microsites Config
          </NavLink>
        </div>
      </div>

      {/* Components Section */}
      <div className="space-y-1">
        <div className={cn(
          "transition-all duration-300 overflow-hidden",
          isCollapsed ? "h-0 opacity-0 group-hover:h-auto group-hover:opacity-100" : "h-auto opacity-100"
        )}>
          <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
            Components
          </h3>
        </div>
        <div className="space-y-1">
          <NavLink href="/manage-components/menu" icon={MenuSquare} collapsed={isCollapsed}>
            Menu
          </NavLink>
          <NavLink href="/manage-components/testimonials" icon={MessageSquare} collapsed={isCollapsed}>
            Testimonials
          </NavLink>
          <NavLink href="/manage-components/language-switcher" icon={Languages} collapsed={isCollapsed}>
            Language Switcher
          </NavLink>
          <NavLink href="/manage-components/food-delivery-embed" icon={UtensilsCrossed} collapsed={isCollapsed}>
            Food Delivery
          </NavLink>
          <NavLink href="/manage-components/careers" icon={Briefcase} collapsed={isCollapsed}>
            Careers
          </NavLink>
        </div>
      </div>

      {/* Optimization Section */}
      <div className="space-y-1">
        <div className={cn(
          "transition-all duration-300 overflow-hidden",
          isCollapsed ? "h-0 opacity-0 group-hover:h-auto group-hover:opacity-100" : "h-auto opacity-100"
        )}>
          <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
            Optimization
          </h3>
        </div>
        <div className="space-y-1">
          <NavLink href="/optimization/whatsapp-links" icon={LinkIcon} collapsed={isCollapsed}>
            WhatsApp Links
          </NavLink>
          <NavLink href="/optimization/seo" icon={Search} collapsed={isCollapsed}>
            SEO
          </NavLink>
        </div>
      </div>
    </>
  )
}