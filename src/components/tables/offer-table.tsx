"use client"

import * as React from "react"
import { useTransition } from "react"
import Link from "next/link"
import type { OfferWithNeedAndSupplier } from "@/types"
import { OFFER_STATUSES, VALIDATION_STATE } from "@prisma/client"
import { type ColumnDef } from "@tanstack/react-table"
import CurrencyList from "currency-list"

import { formatCurrency } from "@/lib/currency"
import type { ProductSelect, SupplierSelect } from "@/lib/offer"
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
import { deleteOffer } from "@/app/offer/actions"

type OfferWithPrice = OfferWithNeedAndSupplier & { ddpPrice: number }

type OfferTableProps = {
  offers: OfferWithPrice[]
  products: ProductSelect[]
  suppliers: SupplierSelect[]
}

const OfferTable = ({ offers, products, suppliers }: OfferTableProps) => {
  const [, startTransition] = useTransition()

  const columns = React.useMemo<ColumnDef<OfferWithPrice, unknown>[]>(
    () => [
      {
        accessorKey: "needId",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Product" />
        ),
        cell: ({ row }) => row.original.need.name,
      },
      {
        accessorKey: "supplierId",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Supplier" />
        ),
        cell: ({ row }) => row.original.supplier.name,
      },
      {
        accessorKey: "fobPrice",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="FOB Price" />
        ),
        cell: ({ row }) => formatCurrency(row.original.fobPrice),
      },
      {
        accessorKey: "currency",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Currency" />
        ),
        cell: ({ row }) => {
          return CurrencyList.getAll("en_US")[row.original.currency]?.name
        },
      },
      {
        accessorKey: "validation",
      },
      {
        accessorKey: "status",
      },
      {
        accessorKey: "image",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Image" />
        ),
      },
      {
        accessorKey: "quantityPerContainer",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Quantity per container"
          />
        ),
      },
      {
        accessorKey: "ddpPrice",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="DDP Price" />
        ),
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
                  <Link href={`offer/${id}`}>
                    <Icons.edit
                      className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                      aria-hidden="true"
                    />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => startTransition(() => deleteOffer(id))}
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
      data={offers || []}
      newRowLink="/offer/new"
      getRowClassName={(row) => {
        switch (row.original.status) {
          case OFFER_STATUSES.ACTIVE:
            return "bg-blue-50 dark:bg-blue-400"
          case OFFER_STATUSES.CLOSED:
            return "bg-red-50 dark:bg-red-400"
          case OFFER_STATUSES.OPEN:
            return "bg-green-50 dark:bg-green-400"
          default:
            return ""
        }
      }}
      columnVisibility={{ status: false, validation: false }}
      filterableColumns={[
        {
          id: "needId",
          title: "Product",
          options: products.map(({ id, name }) => ({
            label: String(name),
            value: String(id),
          })),
        },
        {
          id: "supplierId",
          title: "Supplier",
          options: suppliers.map(({ id, name }) => ({
            label: String(name),
            value: String(id),
          })),
        },
        {
          id: "fobPrice",
          title: "FOB Price",
          type: "number",
        },
        {
          id: "currency",
          title: "Currency",
          options: Object.values(CurrencyList.getAll("en_US")).map(
            (currency: { code: string; name: string }) => ({
              label: String(currency.name),
              value: String(currency.code),
            })
          ),
        },
        {
          id: "validation",
          title: "Validation",
          options: Object.entries(VALIDATION_STATE).map(([key, label]) => ({
            label: String(label),
            value: String(key),
          })),
        },
        {
          id: "status",
          title: "Status",
          options: Object.entries(OFFER_STATUSES).map(([key, label]) => ({
            label: String(label),
            value: String(key),
          })),
        },
        {
          id: "quantityPerContainer",
          title: "Quantity Per Container",
          type: "number",
        },
      ]}
    />
  )
}

export default OfferTable
