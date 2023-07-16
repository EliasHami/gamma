"use client"

import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
} from "@/types"
import { type Table } from "@tanstack/react-table"

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  filterableColumns: DataTableFilterableColumn<TData>[]
  searchableColumns: DataTableSearchableColumn<TData>[]
}

export default function DataTableToolbar<TData>({
  table,
  searchableColumns,
  filterableColumns,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  return (
    <div className="flex items-center justify-between overflow-auto py-4">
      <div className="flex flex-1 items-center space-x-2">
        {searchableColumns.length > 0 &&
          searchableColumns.map(
            (column) =>
              table.getColumn(column.id ? String(column.id) : "") && (
                <Input
                  key={String(column.id)}
                  placeholder={`Filter ${column.title}...`}
                  value={
                    (table
                      .getColumn(String(column.id))
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn(String(column.id))
                      ?.setFilterValue(event.target.value)
                  }
                  className="h-8 w-[150px] lg:w-[250px]"
                />
              )
          )}
        {filterableColumns.length > 0 &&
          filterableColumns.map(
            (column) =>
              table.getColumn(column.id ? String(column.id) : "") && (
                <DataTableFacetedFilter
                  key={String(column.id)}
                  column={table.getColumn(column.id ? String(column.id) : "")}
                  title={column.title}
                  options={column.options}
                />
              )
          )}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="ghost"
            className="h-8 px-2 lg:px-3"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <Icons.close className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  )
}
