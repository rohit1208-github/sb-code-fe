"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";

export type Testimonial = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  status: "published" | "draft" | "archived";
  createdAt: string;
  branch: number;
  microsites: number[];
};

export const TestimonialColumns: ColumnDef<Testimonial>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer Name" />
    ),
  },

  {
    accessorKey: "content",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Comment" />
    ),
    cell: ({ row }) => {
      const comment = row.getValue("content") as string;
      return (
        <div className="max-w-[500px] truncate font-medium">{comment}</div>
      );
    },
  },
  {
    accessorKey: "is_active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("is_active") as boolean;
      return (
        <Badge variant={status ? "success" : "destructive"}>
          {status ? "Active" : "Inactive"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "branch",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Branch" />
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
];
