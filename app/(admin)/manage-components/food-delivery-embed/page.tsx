'use client'

import { useState } from 'react'
import { DeliveryConfigTable } from './components/delivery-config-table'
import { DeliveryConfigDialog } from './components/delivery-config-dialog'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function FoodDeliveryPage() {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Food Delivery Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage food delivery service integrations and configurations
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Configuration
        </Button>
      </div>

      <DeliveryConfigTable />
      
      <DeliveryConfigDialog 
        open={open} 
        onOpenChange={setOpen}
      />
    </div>
  )
} 