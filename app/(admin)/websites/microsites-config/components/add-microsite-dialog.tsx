'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PlusIcon } from '@radix-ui/react-icons'
import { AddMicrositeForm } from './add-microsite-form'
import { useState } from 'react'

export function AddMicrositeDialog() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Microsite
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Microsite</DialogTitle>
          <DialogDescription>
            Create a new microsite by filling out the form below.
          </DialogDescription>
        </DialogHeader>
        <AddMicrositeForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  )
} 