"use client"

import * as React from "react"
import { useTransition } from "react"
import Link from "next/link"
import {
  DEPARTMENT,
  VALIDATION_STATE,
  type Company,
  type Prisma,
} from "@prisma/client"
import { type ColumnDef } from "@tanstack/react-table"
import { getData, getName } from "country-list"

import { formatCurrency } from "@/lib/currency"
import type {
  ProductCapacitySelect,
  ProductFamilySelect,
  ProductSubFamilySelect,
} from "@/lib/product"
import { compareFilterFn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import LoadingSpinner from "@/components/Spinner"
import { deleteProduct } from "@/app/(sourcing)/product/actions"

type ProductWithCategories = Prisma.ProductNeedGetPayload<{
  include: { family: true; subFamily: true; capacity: true }
}>

type ProductTableProps = {
  products: ProductWithCategories[]
  productFamilies: ProductFamilySelect[]
  productSubFamilies: ProductSubFamilySelect[]
  productCapacities: ProductCapacitySelect[]
  company: Company
}

const ProductTable = ({
  products,
  productFamilies,
  productSubFamilies,
  productCapacities,
  company,
}: ProductTableProps) => {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = React.useState(false)

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
        cell: ({ row }) => row.original.family?.name,
      },
      {
        accessorKey: "subFamilyId",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Sub Family" />
        ),
        cell: ({ row }) => row.original.subFamily?.name,
      },
      {
        accessorKey: "capacityId",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Capacity" />
        ),
        cell: ({ row }) => row.original.capacity?.name,
      },
      {
        accessorKey: "country",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Country" />
        ),
        cell: ({ row }) => getName(row.original.country),
      },
      {
        accessorKey: "targetPublicPrice",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Target Public Price" />
        ),
        cell: ({ row }) =>
          formatCurrency(row.original.targetPublicPrice, company.currency),
        filterFn: compareFilterFn<ProductWithCategories>,
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
            <Dialog open={open} onOpenChange={setOpen}>
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
                  <DialogTrigger asChild>
                    <DropdownMenuItem>
                      <Icons.trash
                        className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                        aria-hidden="true"
                      />
                      Delete
                    </DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your product and all related offers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    onClick={() =>
                      startTransition(async () => {
                        await deleteProduct(id)
                        setOpen(false)
                      })
                    }
                  >
                    {isPending && <LoadingSpinner />} Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        },
      },
    ],
    [company.currency, isPending, open, setOpen]
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
          title: "Filter name...",
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
          options: getData().map((country) => ({
            label: String(country.name),
            value: String(country.code),
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
        {
          id: "targetPublicPrice",
          title: "Target Public Price",
          type: "number",
        },
      ]}
    />
  )
}

export default ProductTable
