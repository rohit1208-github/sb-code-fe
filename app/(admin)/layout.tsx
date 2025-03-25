"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import dynamic from "next/dynamic";

// Dynamically import icons
const Menu = dynamic(() => import("lucide-react").then((mod) => mod.Menu));
const LayoutDashboard = dynamic(() =>
  import("lucide-react").then((mod) => mod.LayoutDashboard)
);
const Globe = dynamic(() => import("lucide-react").then((mod) => mod.Globe));
const Building2 = dynamic(() =>
  import("lucide-react").then((mod) => mod.Building2)
);
const Users = dynamic(() => import("lucide-react").then((mod) => mod.Users));
const UserCog = dynamic(() =>
  import("lucide-react").then((mod) => mod.UserCog)
);
const Palette = dynamic(() =>
  import("lucide-react").then((mod) => mod.Palette)
);
const FileCode = dynamic(() =>
  import("lucide-react").then((mod) => mod.FileCode)
);
const MenuSquare = dynamic(() =>
  import("lucide-react").then((mod) => mod.MenuSquare)
);
const MessageSquare = dynamic(() =>
  import("lucide-react").then((mod) => mod.MessageSquare)
);
const Languages = dynamic(() =>
  import("lucide-react").then((mod) => mod.Languages)
);
const UtensilsCrossed = dynamic(() =>
  import("lucide-react").then((mod) => mod.UtensilsCrossed)
);
const Briefcase = dynamic(() =>
  import("lucide-react").then((mod) => mod.Briefcase)
);
const Settings = dynamic(() =>
  import("lucide-react").then((mod) => mod.Settings)
);
const LinkIcon = dynamic(() => import("lucide-react").then((mod) => mod.Link));
const Search = dynamic(() => import("lucide-react").then((mod) => mod.Search));

function NavLink({
  href,
  children,
  icon: Icon,
}: {
  href: string;
  children: React.ReactNode;
  icon: any;
  collapsed?: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  // Prefetch the next page on hover
  const handleMouseEnter = () => {
    const prefetchLink = document.createElement("link");
    prefetchLink.rel = "prefetch";
    prefetchLink.href = href;
    document.head.appendChild(prefetchLink);
  };

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "w-full justify-start gap-2",
        isActive && "bg-accent text-accent-foreground"
      )}
      onMouseEnter={handleMouseEnter}
    >
      <Link href={href} className="flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0" />
        <span>{children}</span>
      </Link>
    </Button>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
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
          "hidden lg:block border-r bg-card",
          "w-[280px]",
          "fixed top-0 left-0 h-screen z-30"
        )}
      >
        <nav className="flex-1 space-y-2 p-4">
          <NavigationContent />
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto lg:pl-[280px]">
        <div className="container py-6">{children}</div>
      </main>
    </div>
  );
}

function NavigationContent() {
  return (
    <>
      {/* Dashboard */}
      <div>
        <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
          Key Navigation
        </h3>
        <NavLink href="/dashboard" icon={LayoutDashboard}>
          Dashboard
        </NavLink>
      </div>

      {/* SB Management Section */}
      <div className="space-y-1">
        <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
          SB Management
        </h3>
        <div className="space-y-1">
          <NavLink href="/sb-management/countries" icon={Globe}>
            Countries
          </NavLink>
          <NavLink href="/sb-management/branches" icon={Building2}>
            Branches
          </NavLink>
          <NavLink href="/sb-management/roles" icon={UserCog}>
            Roles
          </NavLink>
          <NavLink href="/sb-management/staff" icon={Users}>
            Staff
          </NavLink>
        </div>
      </div>

      {/* Websites Section */}
      <div className="space-y-1">
        <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
          Websites
        </h3>
        <div className="space-y-1">
          <NavLink href="/websites/microsites-config" icon={FileCode}>
            Microsites Config
          </NavLink>
        </div>
      </div>

      {/* Components Section */}
      <div className="space-y-1">
        <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
          Components
        </h3>
        <div className="space-y-1">
          <NavLink href="/manage-components/menu" icon={MenuSquare}>
            Menu
          </NavLink>
          <NavLink href="/manage-components/testimonials" icon={MessageSquare}>
            Testimonials
          </NavLink>
          <NavLink
            href="/manage-components/food-delivery-embed"
            icon={UtensilsCrossed}
          >
            Food Delivery
          </NavLink>
          <NavLink href="/manage-components/careers" icon={Briefcase}>
            Careers
          </NavLink>
        </div>
      </div>

      {/* Optimization Section */}
      <div className="space-y-1">
        <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
          Optimization
        </h3>
        <div className="space-y-1">
          <NavLink href="#" icon={LinkIcon}>
            WhatsApp Links
          </NavLink>
          <NavLink href="#" icon={Search}>
            SEO
          </NavLink>
        </div>
      </div>
    </>
  );
}
