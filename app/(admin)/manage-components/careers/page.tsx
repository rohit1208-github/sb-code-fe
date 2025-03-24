"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { CareerPosting } from "./types";
import { CareersTable } from "./components/careers-table";
import { CareerFormDialog } from "./components/career-form-dialog";

export default function CareersPage() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  // Mock data - will be replaced with API call
  const [careers] = useState<CareerPosting[]>([
    {
      id: "1",
      title: "Senior Chef",
      department: "Kitchen",
      location: "Dubai",
      jobType: "full-time",
      experienceLevel: "senior",
      description: "We are looking for an experienced Senior Chef...",
      requirements: ["5+ years experience", "Culinary degree", "Team management"],
      status: "active",
      postedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    },
  ]);

  const handleCreate = async (data: CareerPosting) => {
    try {
      // API integration will be added here
      toast({
        title: "Success",
        description: "Career posting created successfully",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create career posting",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Career Postings</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Posting
        </Button>
      </div>

      <CareersTable careers={careers} />
      
      <CareerFormDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleCreate}
      />
    </div>
  );
} 