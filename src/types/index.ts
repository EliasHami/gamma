import type { HTMLInputTypeAttribute } from "react"
import type { Prisma } from "@prisma/client"

export type Option = {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface DataTableSearchableColumn<TData> {
  id: keyof TData
  title: string
  type?: HTMLInputTypeAttribute
}

export interface DataTableFilterableColumn<TData>
  extends DataTableSearchableColumn<TData> {
  options?: Option[]
}

export type CompareFilterValue = {
  operation: "===" | ">" | "<"
  value: number
}

export type OfferWithNeedAndSupplier = Prisma.OfferGetPayload<{
  include: { need: true; supplier: true }
}>
