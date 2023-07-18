"use client"

import * as React from "react"
import { useTransition } from "react"
import Link from "next/link"
import { SUPPLIER_STATUSES, type Supplier } from "@prisma/client"
import { type ColumnDef } from "@tanstack/react-table"
import { getData, getName } from "country-list"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/data-table/data-table"
import DataTableColumnHeader from "@/components/data-table/data-table-column-header"
import { Icons } from "@/components/icons"
import { deleteSupplier } from "@/app/supplier/actions"

type SupplierTableProps = {
  suppliers: Supplier[]
}

const SupplierTable = ({ suppliers }: SupplierTableProps) => {
  const [, startTransition] = useTransition()

  const columns = React.useMemo<ColumnDef<Supplier, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
      },
      {
        accessorKey: "phone",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Phone" />
        ),
      },
      {
        accessorKey: "country",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Country" />
        ),
        cell: ({ row }) => getName(row.original.country),
      },
      {
        accessorKey: "status",
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const id = row.original.id

          return (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <Icons.horizontalThreeDots className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href={`supplier/${id}`}>
                    <Icons.edit
                      className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                      aria-hidden="true"
                    />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => startTransition(() => deleteSupplier(id))}
                >
                  <Icons.trash
                    className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                    aria-hidden="true"
                  />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    []
  )

  return (
    <DataTable
      columns={columns}
      data={suppliers || []}
      newRowLink="/supplier/new"
      getRowClassName={(row) => {
        switch (row.original.status) {
          case SUPPLIER_STATUSES.EMAIL_SENT:
            return "bg-yellow-50 dark:bg-yellow-400"
          case SUPPLIER_STATUSES.CATALOGUE_RECEIVED:
            return "bg-orange-50 dark:bg-orange-400"
          case SUPPLIER_STATUSES.PRICE_LIST_RECEIVED:
            return "bg-green-50 dark:bg-green-400"
          default:
            return ""
        }
      }}
      columnVisibility={{ status: false }}
      searchableColumns={[
        {
          id: "name",
          title: "Filter name...",
        },
        {
          id: "email",
          title: "Filter email...",
          type: "email",
        },
        {
          id: "phone",
          title: "Filter phone...",
          type: "phone",
        },
      ]}
      filterableColumns={[
        {
          id: "country",
          title: "Country",
          options: getData().map((country) => ({
            label: String(country.name),
            value: String(country.code),
          })),
        },
        {
          id: "status",
          title: "Status",
          options: Object.entries(SUPPLIER_STATUSES).map(([key, label]) => ({
            label: String(label),
            value: String(key),
          })),
        },
      ]}
    />
  )
}

export default SupplierTable
