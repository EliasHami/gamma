"use client"

import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { Input } from "@/components/ui/input"
import { DEPARTMENT } from "@prisma/client"
import { type Table } from "@tanstack/react-table"

type DataTableToolbarProps<TData> = {
  table: Table<TData>
}

export default function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between overflow-auto py-4">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter name"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("department") && (
          <DataTableFacetedFilter
            column={table.getColumn("department")}
            title="Department"
            options={Object.entries(DEPARTMENT).map(([key, value]) => ({
              label: String(value),
              value: String(key),
            }))}
          />
        )}
        {table.getColumn("country") && (
          <DataTableFacetedFilter
            column={table.getColumn("country")}
            title="country"
            options={[
              { label: "Andorra", value: "Andorra" },
              { label: "Angola", value: "Angola" },
            ]}
          />
        )}
      </div>
    </div>
  )
}
