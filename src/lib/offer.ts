import { prisma } from "@/server/db"
import type { Prisma } from "@prisma/client"

const fetchSelect = () => {
  const productsPromise = prisma.productNeed.findMany({
    select: {
      id: true,
      name: true,
    },
  })
  const suppliersPromise = prisma.supplier.findMany({
    select: {
      id: true,
      name: true,
    },
  })
  return Promise.all([productsPromise, suppliersPromise])
}

export type ProductSelect = Prisma.ProductNeedGetPayload<{
  select: { id: true; name: true }
}>
export type SupplierSelect = Prisma.SupplierGetPayload<{
  select: { id: true; name: true }
}>

export { fetchSelect }
