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
import type {
  ProductCapacitySelect,
  ProductFamilySelect,
  ProductSubFamilySelect,
} from "@/lib/product"
import {
  DEPARTMENT,
  VALIDATION_STATE,
  type Prisma,
  type ProductNeed,
} from "@prisma/client"
import { type ColumnDef } from "@tanstack/react-table"
import { getNames } from "country-list"
import Link from "next/link"
import { useTransition } from "react"

type ProductWithCategories = Prisma.ProductNeedGetPayload<{
  include: { family: true; subFamily: true; capacity: true }
}>

type ProductTableProps = {
  products: ProductWithCategories[]
  productFamilies: ProductFamilySelect[]
  productSubFamilies: ProductSubFamilySelect[]
  productCapacities: ProductCapacitySelect[]
}

const ProductTable = ({
  products,
  productFamilies,
  productSubFamilies,
  productCapacities,
}: ProductTableProps) => {
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
        accessorKey: "familyId",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Family" />
        ),
        cell: ({ row }) => row.original.family.name,
      },
      {
        accessorKey: "subFamilyId",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Sub Family" />
        ),
        cell: ({ row }) => row.original.subFamily.name,
      },
      {
        accessorKey: "capacityId",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Capacity" />
        ),
        cell: ({ row }) => row.original.capacity.name,
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
        accessorKey: "state",
        filterFn: (row, id, filterValue) => row.original.state === filterValue,
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
      newRowLink="/product/new"
      getRowClassName={(row) =>
        row.original.state === VALIDATION_STATE.VALIDATED ? "bg-green-50" : ""
      }
      columnVisibility={{ state: false }}
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
        {
          id: "familyId",
          title: "Family",
          options: productFamilies.map(({ id, name }) => ({
            label: String(name),
            value: String(id),
          })),
        },
        {
          id: "subFamilyId",
          title: "Sub family",
          options: productSubFamilies.map(({ id, name }) => ({
            label: String(name),
            value: String(id),
          })),
        },
        {
          id: "capacityId",
          title: "Capacity",
          options: productCapacities.map(({ id, name }) => ({
            label: String(name),
            value: String(id),
          })),
        },
        {
          id: "country",
          title: "Country",
          options: getNames().map((name) => ({
            label: String(name),
            value: String(name),
          })),
        },
        {
          id: "state",
          title: "State",
          options: Object.entries(VALIDATION_STATE).map(([key, label]) => ({
            label: String(label),
            value: String(key),
          })),
        },
      ]}
    />
  )
}

export default ProductTable
