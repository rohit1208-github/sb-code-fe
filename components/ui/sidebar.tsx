import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    href: string
    title: string
    icon?: React.ReactNode
  }[]
}

export function Sidebar({ className, items, ...props }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "w-64 min-h-screen gradient-sidebar border-r",
        className
      )}
      {...props}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mb-8">
            <h2 className="px-4 text-lg font-semibold tracking-tight text-primary">
              Restaurant Admin
            </h2>
          </div>
          <nav className="space-y-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                  "hover-glass",
                  pathname === item.href
                    ? "active-glass text-accent"
                    : "text-muted-foreground"
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
} 