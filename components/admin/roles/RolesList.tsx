"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRoles } from "@/hooks/useRoles";
import { RoleActions } from "./RoleActions";
import { PermissionMatrix } from "./PermissionMatrix";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export function RolesList() {
  const { data: roles, isLoading, error } = useRoles();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  if (isLoading) return <div>Loading roles...</div>;
  if (error) return <div>Error loading roles: {error.message}</div>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Permissions</TableHead>
            {/* <TableHead>Created At</TableHead> */}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles?.map((role) => (
            <TableRow key={role.id}>
              <TableCell className="font-medium">{role.name}</TableCell>
              <TableCell>{role?.description}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {role?.permissions && role?.permissions.length > 0 ? (
                    role?.permissions.map((permission) => (
                      <Badge key={permission} variant="secondary">
                        {permission}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="secondary">No permissions</Badge>
                  )}
                </div>
              </TableCell>
              {/* <TableCell>
                {new Date(role.createdAt).toLocaleDateString()}
              </TableCell> */}
              <TableCell className="text-right">
                {/* <RoleActions role={role} onEdit={() => setSelectedRole(role)} /> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedRole && (
        <PermissionMatrix
          role={selectedRole}
          onClose={() => setSelectedRole(null)}
        />
      )}
    </div>
  );
}
