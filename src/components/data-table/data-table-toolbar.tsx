"use client"

import Link from "next/link"
import type {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
} from "@/types"
import { type Table } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableCompareFilter } from "@/components/data-table/data-table-compare-filter"
import { DataTableDateFilter } from "@/components/data-table/data-table-date-filter"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { Icons } from "@/components/icons"

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  filterableColumns: DataTableFilterableColumn<TData>[]
  searchableColumns: DataTableSearchableColumn<TData>[]
  newRowLink?: string
}

export default function DataTableToolbar<TData>({
  table,
  searchableColumns,
  filterableColumns,
  newRowLink,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  return (
    <div className="flex w-full items-center justify-between overflow-auto px-1 py-4">
      <div className="flex flex-1 flex-wrap items-center gap-2 space-x-2">
        {searchableColumns.length > 0 &&
          searchableColumns.map(
            (column) =>
              table.getColumn(column.id ? String(column.id) : "") && (
                <Input
                  key={String(column.id)}
                  placeholder={`${column.title}`}
                  type={column.type ?? "text"}
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
                  className="h-8 w-[100px] lg:w-[200px]"
                />
              )
          )}
        {filterableColumns.length > 0 &&
          filterableColumns.map(
            (column) =>
              table.getColumn(column.id ? String(column.id) : "") && (
                <div key={String(column.id)}>
                  {column.type === "date-range" && (
                    <DataTableDateFilter
                      column={table.getColumn(
                        column.id ? String(column.id) : ""
                      )}
                      title={column.title}
                    />
                  )}
                  {column.type === "number" ? (
                    <DataTableCompareFilter
                      column={table.getColumn(
                        column.id ? String(column.id) : ""
                      )}
                      title={column.title}
                    />
                  ) : (
                    column.options && (
                      <DataTableFacetedFilter
                        column={table.getColumn(
                          column.id ? String(column.id) : ""
                        )}
                        title={column.title}
                        options={column.options}
                      />
                    )
                  )}
                </div>
              )
          )}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="ghost"
            className="h-8 px-2 lg:px-3"
            onClick={() => table.resetColumnFilters()}
            title="Reset filters"
          >
            <Icons.close className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2 self-start">
        {newRowLink && (
          <Link aria-label="Create new row" href={newRowLink}>
            <div
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "h-8",
                })
              )}
            >
              <Icons.addCircle className="mr-2 h-4 w-4" aria-hidden="true" />
              New
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}
