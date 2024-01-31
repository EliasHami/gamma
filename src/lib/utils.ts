import type { CompareFilterValue } from "@/types"
import { OFFER_STATUSES } from "@prisma/client"
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

export const getStatusColor = (status: string) => {
  switch (status) {
    case OFFER_STATUSES.ACTIVE:
      return "text-green-700"
    case OFFER_STATUSES.CLOSED:
      return "text-red-700"
    case OFFER_STATUSES.OPEN:
      return "text-black"
    default:
      return ""
  }
}

export const getPublicPriceProps = (
  publicPrice: number,
  targetPublicPrice: number
) => {
  const startRange = targetPublicPrice * 0.9
  const endRange = targetPublicPrice * 1.1
  let className = "text-gray-700"
  let title = ""
  if (publicPrice < startRange) {
    className = "text-green-700"
    title = "Below target price"
  }
  if (publicPrice > endRange) {
    className = "text-red-700"
    title = "Above target price"
  }
  if (publicPrice >= startRange && publicPrice <= endRange) {
    className = "text-orange-700"
    title = "Within 10% range of target price"
  }

  return { className, title }
}
