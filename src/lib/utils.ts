import type { CompareFilterValue } from "@/types"
import type { Row } from "@tanstack/react-table"
import { clsx, type ClassValue } from "clsx"
import { isWithinInterval } from "date-fns"
import { type DateRange } from "react-day-picker"
import { toast } from "react-hot-toast"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function catchError(err: unknown) {
  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message
    })
    return toast.error(errors.join("\n"))
  } else if (err instanceof Error) {
    return toast.error(err.message)
  } else {
    return toast.error("Something went wrong, please try again later.")
  }
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

export function compareDateRangeFn<TData>(
  row: Row<TData>,
  id: string,
  filterValue: DateRange
) {
  if (!filterValue.from || !filterValue.to) return true
  const date = new Date(String(row.original[id as keyof TData]))

  return isWithinInterval(date, {
    start: filterValue.from,
    end: filterValue.to,
  })
}

export function formatBytes(
  bytes: number,
  decimals = 0,
  sizeType: "accurate" | "normal" = "normal"
) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"]
  if (bytes === 0) return "0 Byte"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`
}

export function isArrayOfFile(files: unknown): files is File[] {
  const isArray = Array.isArray(files)
  if (!isArray) return false
  return files.every((file) => file instanceof File)
}
