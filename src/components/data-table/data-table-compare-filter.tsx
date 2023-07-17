import { type Column } from "@tanstack/react-table"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { CompareFilterValue } from "@/types"

interface DataTableCompareFilter<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
}

const OPERATIONS = [
  { label: "Equals", value: "===", icon: Icons.equal },
  { label: "More than", value: ">", icon: Icons.chevronRight },
  { label: "Less than", value: "<", icon: Icons.chevronLeft },
]

export function DataTableCompareFilter<TData, TValue>({
  column,
  title,
}: DataTableCompareFilter<TData, TValue>) {
  const selectedValue = (column?.getFilterValue() as CompareFilterValue) || {
    operation: null,
    value: null,
  }
  const Icon = OPERATIONS.find(
    (operation) => selectedValue.operation === operation.value
  )?.icon

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label="Filter rows"
          variant="outline"
          size="sm"
          className="h-8 border-dashed"
        >
          <Icons.addCircle className="h-4 w-4" aria-hidden="true" />
          {title}
          {Icon && <Icon className="mx-2 h-4 w-4" aria-hidden="true" />}
          {selectedValue.value || ""}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {OPERATIONS.map((operation) => {
                const isSelected = selectedValue.operation === operation.value
                return (
                  <CommandItem
                    key={operation.value}
                    onSelect={() => {
                      if (isSelected) {
                        column?.setFilterValue(undefined)
                      } else {
                        column?.setFilterValue({
                          ...selectedValue,
                          operation: operation.value,
                        })
                      }
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Icons.check
                        className={cn("h-4 w-4")}
                        aria-hidden="true"
                      />
                    </div>
                    <span>{operation.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
        <Separator />
        <Input
          placeholder="Value to compare..."
          type="number"
          value={selectedValue.value}
          onChange={(event) =>
            column?.setFilterValue({
              ...selectedValue,
              value: event.target.valueAsNumber,
            })
          }
          className="h-8 border-none focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 "
        />
      </PopoverContent>
    </Popover>
  )
}
