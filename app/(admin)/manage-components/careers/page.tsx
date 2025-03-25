"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { CareerPosting } from "./types";
import { CareersTable } from "./components/careers-table";
import { CareerFormDialog } from "./components/career-form-dialog";
import { useCareerPostings } from "@/hooks/useCareers";

export default function CareersPage() {
  const [open, setOpen] = useState(false);
  const [initialData, setInitialData] = useState<CareerPosting | null>(null);
  const { toast } = useToast();

  const { careerPostings, isLoading, refetch, deleteCareerPosting } =
    useCareerPostings();

  const handleEdit = (career: CareerPosting) => {
    setOpen(true);
    setInitialData(career);
  };

  const handleDelete = async (career: CareerPosting) => {
    await deleteCareerPosting(career.id?.toString() || "");
    refetch();
  };
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Career Postings
        </h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Posting
        </Button>
      </div>

      <CareersTable
        careers={careerPostings}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CareerFormDialog
        open={open}
        onOpenChange={setOpen}
        initialData={initialData || undefined}
      />
    </div>
  );
}
