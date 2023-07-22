import * as React from "react"
import type { CompareFilterValue } from "@/types"
import { type Column } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/components/icons"

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
          <Icons.addCircle className="mr-2 h-4 w-4" aria-hidden="true" />
          {title}
          {Icon && <Icon className="mx-2 h-4 w-4" aria-hidden="true" />}
          {selectedValue.value || ""}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <RadioGroup
          defaultValue="==="
          value={selectedValue.operation}
          className="my-2"
          onValueChange={(value) => {
            const isSelected = selectedValue.operation === value

            if (isSelected) {
              column?.setFilterValue(undefined)
            } else {
              column?.setFilterValue({
                ...selectedValue,
                operation: value,
              })
            }
          }}
        >
          {OPERATIONS.map((operation) => {
            return (
              <div
                key={operation.value}
                className="ml-2 flex items-center space-x-2"
              >
                <RadioGroupItem value={operation.value} id={operation.value} />
                <Label htmlFor={operation.value}>{operation.label}</Label>
              </div>
            )
          })}
        </RadioGroup>
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
