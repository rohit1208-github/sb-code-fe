import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
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
  const [searchQuery, setSearchQuery] = React.useState('')

  // Get selected branches data for display
  const selectedBranches = React.useMemo(() => {
    return branches.filter(branch => value.includes(branch.id))
  }, [branches, value])

  console.log('🔍 BranchSelect Render:', {
    branches: branches.map(b => ({ id: b.id, name: b.name })),
    currentValue: value
  })

  console.log('📌 Selected Branches:', selectedBranches.map(b => ({ id: b.id, name: b.name })))

  const filteredBranches = React.useMemo(() => {
    return branches.filter(branch => 
      branch.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [branches, searchQuery])

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
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Search branches..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandEmpty>No branch found.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-60">
              {filteredBranches.map(branch => {
                const isSelected = value.includes(branch.id)

                console.log('🎯 Rendering Branch Item:', {
                  id: branch.id,
                  name: branch.name,
                  isSelected
                })

                return (
                  <CommandItem
                    key={branch.id}
                    onSelect={() => {
                      console.log('🔄 Handling Selection:', {
                        branchId: branch.id,
                        branchName: branch.name,
                        currentValue: value,
                        willBeSelected: !isSelected
                      })

                      const newValue = isSelected
                        ? value.filter(id => id !== branch.id)
                        : [...value, branch.id]

                      onChange(newValue)
                      // Don't close the popover to allow multiple selections
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        isSelected ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {branch.name}
                  </CommandItem>
                )
              })}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 