import type { CompareFilterValue } from "@/types"
import type { Row } from "@tanstack/react-table"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message
  return String(error)
}

export function compareFilterFn<TData>(
  row: Row<TData>,
  id: string,
  filterValue: CompareFilterValue
) {
  return Boolean(
    eval(
      String(row.original[id as keyof TData]) +
        filterValue.operation +
        String(filterValue.value)
    )
  )
}
