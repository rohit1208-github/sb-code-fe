"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBranches } from "@/hooks/useBranches";
import { BranchDialog } from "./branch-dialog";
import { DeleteBranchDialog } from "./delete-branch-dialog";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import type { Branch } from "@/types/api";

interface BranchesTableProps {
  branches: Branch[];
  isLoading: boolean;
}

export function BranchesTable({ branches, isLoading }: BranchesTableProps) {
  if (isLoading) {
    return <div>Loading branches...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="heading-enhanced bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
          Branches
        </CardTitle>
        <BranchDialog
          mode="add"
          trigger={
            <Button variant="success">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Branch
            </Button>
          }
        />
      </CardHeader>
      <div className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-enhanced">Name</TableHead>
              <TableHead className="text-enhanced">Country</TableHead>
              <TableHead className="text-enhanced">Address</TableHead>
              <TableHead className="text-enhanced">Phone</TableHead>
              <TableHead className="text-enhanced">Email</TableHead>
              <TableHead className="text-enhanced">Status</TableHead>
              <TableHead className="text-enhanced">
                Online Ordering
              </TableHead>
              <TableHead className="text-enhanced text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches &&
              branches.length > 0 &&
              branches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell className="font-medium text-enhanced">
                    {branch.name}
                  </TableCell>
                  <TableCell className="font-medium">
                    {branch.country_name}
                  </TableCell>
                  <TableCell>{branch.address}</TableCell>
                  <TableCell>{branch.phone}</TableCell>
                  <TableCell>{branch.email}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium",
                        branch.is_active
                          ? "bg-green-500/20 text-green-500"
                          : "bg-red-500/20 text-red-500"
                      )}
                    >
                      {branch.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium",
                        branch.has_online_ordering
                          ? "bg-green-500/20 text-green-500"
                          : "bg-red-500/20 text-red-500"
                      )}
                    >
                      {branch.has_online_ordering ? "Enabled" : "Disabled"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <BranchDialog
                        mode="edit"
                        branch={branch}
                        trigger={
                          <Button variant="outline" size="icon">
                            <PencilIcon className="h-4 w-4 text-yellow-500" />
                          </Button>
                        }
                      />
                      <DeleteBranchDialog
                        branch={branch}
                        trigger={
                          <Button variant="outline" size="icon">
                            <TrashIcon className="h-4 w-4 text-red-500" />
                          </Button>
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
