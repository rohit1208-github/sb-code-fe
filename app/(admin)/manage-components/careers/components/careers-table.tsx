"use client";

import { CareerPosting, CareerStatus } from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";

interface CareersTableProps {
  careers: CareerPosting[];
}

const getStatusColor = (status: CareerStatus) => {
  switch (status) {
    case "active":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    case "inactive":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
    case "draft":
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
    default:
      return "";
  }
};

export function CareersTable({ careers }: CareersTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Posted Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {careers.map((career) => (
            <TableRow key={career.id}>
              <TableCell className="font-medium">{career.title}</TableCell>
              <TableCell>{career.department}</TableCell>
              <TableCell>{career.location}</TableCell>
              <TableCell>{career.jobType}</TableCell>
              <TableCell>{career.experienceLevel}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(career.status)}>
                  {career.status}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(career.postedDate).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 