"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { PlusCircle } from "lucide-react"
import { TestimonialColumns } from "./components/columns"
import { AddTestimonialDialog } from "./components/add-testimonial-dialog"

export default function TestimonialsPage() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Testimonials</h2>
        <Button onClick={() => setOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <div className="space-y-4">
        <DataTable 
          columns={TestimonialColumns} 
          data={[]} // Will be populated from API later
          searchKey="customerName"
        />
      </div>

      <AddTestimonialDialog open={open} onOpenChange={setOpen} />
    </div>
  )
} 