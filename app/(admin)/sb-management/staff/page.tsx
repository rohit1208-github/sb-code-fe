"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ColumnDef } from "@tanstack/react-table";
import { StaffMember } from "@/types/staff";
import { useStaff } from "@/hooks/usestaff";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { TrashIcon } from "@radix-ui/react-icons";
export default function StaffPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const { staff = [], isLoading, deleteStaffMember } = useStaff();

  const columns = [
    {
      accessorKey: "first_name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: { original: StaffMember } }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.original.is_active === true
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.is_active === true ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      accessorKey: "lastActive",
      header: "Last Active",
    },
    {
      header: "Actions",
      cell: ({ row }: { row: { original: StaffMember } }) => {
        const router = useRouter();
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/sb-management/staff/${row.original.id}`)
              }
            >
              <Pencil1Icon className="h-4 w-4 text-yellow-500" />
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteStaffMember(row.original.id)}
            >
              <TrashIcon className="h-4 w-4 text-white-500" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Staff Management"
        description="Manage your staff members and their roles."
      />

      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Search staff..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button
          onClick={() => router.push("/sb-management/staff/new")}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Staff Member
        </Button>
      </div>

      <Suspense fallback={<StaffTableSkeleton />}>
        <DataTable
          columns={columns as ColumnDef<StaffMember>[]}
          data={staff || []}
          searchKey="name"
        />
      </Suspense>
    </div>
  );
}

function StaffTableSkeleton() {
  return (
    <div className="rounded-md border">
      <div className="border-b bg-muted/50 p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="border-b p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
