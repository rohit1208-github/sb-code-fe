"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useCountries } from "@/hooks/useCountries";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { PencilIcon, TrashIcon } from "lucide-react";
import { CountryDialog } from "./add-country-dialog";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function CountriesTable() {
  const { toast } = useToast();
  const { countries, isLoading, error, deleteCountry, isDeleting } =
    useCountries();

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this country?")) {
      try {
        await deleteCountry(id);
        toast({
          title: "Success",
          description: "Country deleted successfully",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete country",
        });
      }
    }
  };

  if (isLoading) {
    return <div>Loading countries...</div>;
  }

  if (error) {
    return <div>Error loading countries: {error.message}</div>;
  }

  return (
    <div className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-enhanced">Name</TableHead>
            <TableHead className="text-enhanced">Code</TableHead>
            <TableHead className="text-enhanced">Status</TableHead>
            <TableHead className="text-enhanced">Created At</TableHead>
            <TableHead className="text-enhanced">Updated At</TableHead>
            <TableHead className="text-enhanced text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {countries?.map((country) => (
            <TableRow key={country.id}>
              <TableCell className="font-medium text-enhanced">
                {country.name}
              </TableCell>
              <TableCell className="font-medium">{country.code}</TableCell>
              <TableCell>
                <span
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium",
                    country.is_active
                      ? "bg-green-500/20 text-green-500"
                      : "bg-red-500/20 text-red-500"
                  )}
                >
                  {country.is_active ? "Active" : "Inactive"}
                </span>
              </TableCell>
              <TableCell>{formatDate(country.created_at)}</TableCell>
              <TableCell>{formatDate(country.updated_at)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <CountryDialog
                    mode="edit"
                    country={country}
                    trigger={
                      <Button variant="outline" size="icon">
                        <PencilIcon className="h-4 w-4 text-yellow-500" />
                      </Button>
                    }
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(country.id)}
                    disabled={isDeleting}
                  >
                    <TrashIcon className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {!countries?.length && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No countries found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
