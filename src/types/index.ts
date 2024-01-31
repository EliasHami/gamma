import type { HTMLInputTypeAttribute } from "react"
import type { Prisma } from "@prisma/client"
import { type FileWithPath } from "react-dropzone"
import type { z } from "zod"

import type { imagesSchema } from "@/lib/validations/offer"

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

export type OfferWithSupplier = Prisma.OfferGetPayload<{
  include: { supplier: true }
}>

export type OfferWithProduct = Prisma.OfferGetPayload<{
  include: { need: true }
}>

export type OfferWithNeedAndSupplier = Prisma.OfferGetPayload<{
  include: { need: true; supplier: true }
}>

export type ProductWithOffers = Prisma.ProductNeedGetPayload<{
  include: { offers: true }
}>

export type BarChartData = { name: string; total: number }

export type LineData = Record<string, number>

export type LineChartData = LineData & { name: string }

export type FileWithPreview = FileWithPath & {
  preview: string
  url?: string
}

export type Images = z.infer<typeof imagesSchema>
