"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export function RolesHeader() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Roles Management</h1>
        <p className="text-muted-foreground">
          User roles for managing SB Dashboard. Contact tech team to add or edit
          User Roles
        </p>
      </div>
    </div>
  );
}
