'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Branch } from '@/types/microsites'

interface BranchSelectProps {
  branches: Branch[]
  value: number[]
  onChange: (value: number[]) => void
}

export function BranchSelect({ branches, value, onChange }: BranchSelectProps) {
  const [open, setOpen] = React.useState(false)

  console.log('🔍 BranchSelect Render:', {
    branches: branches.map(b => ({ id: b.id, name: b.name })),
    currentValue: value
  })

  const selectedBranches = React.useMemo(() => 
    branches.filter(branch => value.includes(branch.id)),
    [branches, value]
  )

  console.log('📌 Selected Branches:', selectedBranches.map(b => ({ id: b.id, name: b.name })))

  const handleSelect = React.useCallback((branchId: number) => {
    console.log('🔄 Handling Selection:', {
      branchId,
      currentValue: value,
      willBeSelected: !value.includes(branchId)
    })

    const newValue = value.includes(branchId)
      ? value.filter(id => id !== branchId)
      : [...value, branchId]

    console.log('✨ New Value:', newValue)
    onChange(newValue)
  }, [value, onChange])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex gap-1 flex-wrap">
            {selectedBranches.length > 0 ? (
              selectedBranches.map(branch => (
                <Badge
                  key={branch.id}
                  variant="secondary"
                  className="mr-1"
                >
                  {branch.name}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">Select branches...</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <ScrollArea className="h-60 p-1">
          <div className="space-y-1">
            {branches.map((branch) => {
              const isSelected = value.includes(branch.id)

              console.log('🎯 Rendering Branch Item:', {
                id: branch.id,
                name: branch.name,
                isSelected
              })

              return (
                <div
                  key={branch.id}
                  className={cn(
                    'flex items-center space-x-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground',
                    isSelected && 'bg-accent'
                  )}
                  onClick={() => handleSelect(branch.id)}
                >
                  <Check
                    className={cn(
                      'h-4 w-4',
                      isSelected ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <span>{branch.name}</span>
                </div>
              )}
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
} 