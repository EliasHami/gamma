"use client"

import * as React from "react"
import type {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
} from "@/types"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import DataTablePagination from "@/components/data-table/data-table-pagination"
import DataTableToolbar from "@/components/data-table/data-table-toolbar"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  CardRender?: React.ComponentType<{ row: Row<TData> }>
  data: TData[]
  mode?: "table" | "cards"
  filterableColumns?: DataTableFilterableColumn<TData>[]
  searchableColumns?: DataTableSearchableColumn<TData>[]
  newRowLink?: string
  getRowClassName?: (row: Row<TData>) => string
  columnVisibility?: VisibilityState
}

export function DataTable<TData, TValue>({
  columns,
  CardRender,
  data,
  mode = "table",
  filterableColumns = [],
  searchableColumns = [],
  newRowLink,
  getRowClassName,
  columnVisibility,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: mode === "table" ? 8 : 24,
      },
    },
  })

  return (
    <div className="w-full">
      <DataTableToolbar
        table={table}
        filterableColumns={filterableColumns}
        searchableColumns={searchableColumns}
        newRowLink={newRowLink}
      />
      <div className="rounded-md border">
        {mode === "table" && (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="whitespace-nowrap">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={getRowClassName ? getRowClassName(row) : ""}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
        {mode === "cards" && CardRender && (
          <div className="grid h-[560px] grid-cols-4 gap-4 overflow-auto p-4">
            {table.getRowModel().rows?.length ? (
              table
                .getRowModel()
                .rows.map((row) => <CardRender row={row} key={row.id} />)
            ) : (
              <span> No results.</span>
            )}
          </div>
        )}
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
