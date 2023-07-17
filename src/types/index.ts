import type { HTMLInputTypeAttribute } from "react"

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
