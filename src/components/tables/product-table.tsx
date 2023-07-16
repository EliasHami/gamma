"use client"

import * as React from "react"

import { deleteProduct } from "@/app/product/actions"
import { DataTable } from "@/components/data-table/data-table"
import DataTableColumnHeader from "@/components/data-table/data-table-column-header"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DEPARTMENT, type Prisma, type ProductNeed } from "@prisma/client"
import { type ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { useTransition } from "react"

type ProductWithCategories = Prisma.ProductNeedGetPayload<{
  include: { family: true; subFamily: true; capacity: true }
}>

const ProductTable = ({ products }: { products: ProductWithCategories[] }) => {
  const [, startTransition] = useTransition()

  const columns = React.useMemo<ColumnDef<ProductWithCategories, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
      },
      {
        accessorKey: "department",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Department" />
        ),
      },
      {
        accessorKey: "family.name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Family" />
        ),
      },
      {
        accessorKey: "subFamily.name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Sub Family" />
        ),
      },
      {
        accessorKey: "capacity.name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Capacity" />
        ),
      },
      {
        accessorKey: "country",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Country" />
        ),
      },
      {
        accessorKey: "targetPublicPrice",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Target Public Price" />
        ),
        cell: ({ cell }) => {
          const amount = cell.getValue() as ProductNeed["targetPublicPrice"]
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(amount)

          return formatted
        },
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
                  <Link href={`/product/${id}`}>
                    <Icons.edit
                      className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                      aria-hidden="true"
                    />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => startTransition(() => deleteProduct(id))}
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
      data={products || []}
      searchableColumns={[
        {
          id: "name",
          title: "name",
        },
      ]}
      filterableColumns={[
        {
          id: "department",
          title: "Department",
          options: Object.entries(DEPARTMENT).map(([key, value]) => ({
            label: String(value),
            value: String(key),
          })),
        },
      ]}
    />
  )
}

export default ProductTable
