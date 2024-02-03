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
  const endRange = targetPublicPrice * 1.1
  let className = "text-gray-700"
  let title = ""
  if (publicPrice <= targetPublicPrice) {
    className = "text-green-700"
    title = "Below target price"
  }
  if (publicPrice > endRange) {
    className = "text-red-700"
    title = "Above target price"
  }
  if (publicPrice > targetPublicPrice && publicPrice <= endRange) {
    className = "text-orange-500"
    title = "Within 10% range of target price"
  }

  return { className, title }
}

export const UNITS = {
  METER: { symbol: "m", name: "Meter (m)" },
  KILOMETER: { symbol: "km", name: "Kilometer (km)" },
  CENTIMETER: { symbol: "cm", name: "Centimeter (cm)" },
  INCH: { symbol: "in", name: "Inch (in)" },
  FOOT: { symbol: "ft", name: "Foot (ft)" },
  MILE: { symbol: "mi", name: "Mile (mi)" },
  GRAM: { symbol: "g", name: "Gram (g)" },
  KILOGRAM: { symbol: "kg", name: "Kilogram (kg)" },
  MILLIGRAM: { symbol: "mg", name: "Milligram (mg)" },
  POUND: { symbol: "lb", name: "Pound (lb)" },
  OUNCE: { symbol: "oz", name: "Ounce (oz)" },
  LITER: { symbol: "L", name: "Liter (L)" },
  MILLILITER: { symbol: "mL", name: "Milliliter (mL)" },
  CUBIC_METER: { symbol: "m^3", name: "Cubic meter (m^3)" },
  CUBIC_CENTIMETER: { symbol: "cc", name: "Cubic centimeter (cc)" },
  GALLON: { symbol: "gal", name: "Gallon (gal)" },
  SECOND: { symbol: "s", name: "Second (s)" },
  MINUTE: { symbol: "min", name: "Minute (min)" },
  HOUR: { symbol: "hr", name: "Hour (hr)" },
  DAY: { symbol: "day", name: "Day (day)" },
  CELSIUS: { symbol: "°C", name: "Celsius (°C)" },
  FAHRENHEIT: { symbol: "°F", name: "Fahrenheit (°F)" },
  KELVIN: { symbol: "K", name: "Kelvin (K)" },
  SQUARE_METER: { symbol: "m^2", name: "Square meter (m^2)" },
  SQUARE_KILOMETER: { symbol: "km^2", name: "Square kilometer (km^2)" },
  SQUARE_FOOT: { symbol: "ft^2", name: "Square foot (ft^2)" },
  ACRE: { symbol: "acre", name: "Acre (acre)" },
  METERS_PER_SECOND: { symbol: "m/s", name: "Meters per second (m/s)" },
  KILOMETERS_PER_HOUR: { symbol: "km/h", name: "Kilometers per hour (km/h)" },
  MILES_PER_HOUR: { symbol: "mph", name: "Miles per hour (mph)" },
  JOULE: { symbol: "J", name: "Joule (J)" },
  CALORIE: { symbol: "cal", name: "Calorie (cal)" },
  KILOCALORIE: { symbol: "kcal", name: "Kilocalorie (kcal)" },
  WATT: { symbol: "W", name: "Watt (W)" },
  KILOWATT: { symbol: "kW", name: "Kilowatt (kW)" },
  HORSEPOWER: { symbol: "hp", name: "Horsepower (hp)" },
  PASCAL: { symbol: "Pa", name: "Pascal (Pa)" },
  ATMOSPHERE: { symbol: "atm", name: "Atmosphere (atm)" },
  BAR: { symbol: "bar", name: "Bar (bar)" },
  MILLIMETER_OF_MERCURY: {
    symbol: "mmHg",
    name: "Millimeter of Mercury (mmHg)",
  },
}
