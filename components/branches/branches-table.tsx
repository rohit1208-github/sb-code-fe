"use client"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useBranches } from "@/hooks/useBranches"
import { BranchDialog } from "./branch-dialog"
import { DeleteBranchDialog } from "./delete-branch-dialog"
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline"

export function BranchesTable() {
  const { branches, isLoading } = useBranches()

  if (isLoading) {
    return <div>Loading branches...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Branches</h2>
        <BranchDialog
          mode="add"
          trigger={
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Branch
            </Button>
          }
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Online Ordering</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.map((branch) => (
              <TableRow key={branch.id}>
                <TableCell className="font-medium">{branch.name}</TableCell>
                <TableCell>{branch.country_name}</TableCell>
                <TableCell>{branch.address}</TableCell>
                <TableCell>{branch.phone}</TableCell>
                <TableCell>{branch.email}</TableCell>
                <TableCell>
                  <Badge variant={branch.is_active ? "default" : "secondary"}>
                    {branch.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={branch.has_online_ordering ? "default" : "secondary"}>
                    {branch.has_online_ordering ? "Enabled" : "Disabled"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <BranchDialog
                      mode="edit"
                      branch={branch}
                      trigger={
                        <Button variant="outline" size="icon">
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <DeleteBranchDialog
                      branch={branch}
                      trigger={
                        <Button variant="outline" size="icon">
                          <TrashIcon className="h-4 w-4" />
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
    </div>
  )
} 