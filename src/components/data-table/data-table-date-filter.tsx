import * as React from "react"
import { type Column } from "@tanstack/react-table"
import { format } from "date-fns"
import { type DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Icons } from "@/components/icons"

interface DataTableDateFilter<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
}

export function DataTableDateFilter<TData, TValue>({
  column,
  title,
}: DataTableDateFilter<TData, TValue>) {
  const selectedValue = (column?.getFilterValue() as DateRange) || {
    from: null,
    to: null,
  }

  const handleSelect = (value: DateRange | undefined) => {
    const from =
      value?.from instanceof Date
        ? value?.from?.setHours(0, 0, 0, 0)
        : value?.from
    const to =
      value?.to instanceof Date
        ? value?.to?.setHours(23, 59, 59, 999)
        : value?.to
    column?.setFilterValue({
      from,
      to,
    })
  }
  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !selectedValue && "text-muted-foreground"
            )}
          >
            <Icons.calendar className="mr-2 h-4 w-4" />
            {selectedValue.from ? (
              selectedValue.to ? (
                <>
                  {format(selectedValue.from, "LLL dd, y")} -{" "}
                  {format(selectedValue.to, "LLL dd, y")}
                </>
              ) : (
                format(selectedValue.from, "LLL dd, y")
              )
            ) : (
              title
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={selectedValue?.from}
            selected={selectedValue}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
