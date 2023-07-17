import { prisma } from "@/server/db"
import type { Prisma } from "@prisma/client"

const fetchProductCategoriesSelect = async () => {
  const productFamiliesPromise = prisma.productFamily.findMany({
    select: {
      id: true,
      name: true,
    },
  })
  const productSubFamiliesPromise = prisma.productSubFamily.findMany({
    select: {
      id: true,
      name: true,
      familyId: true,
    },
  })
  const productCapacitiesPromise = prisma.productCapacity.findMany({
    select: {
      id: true,
      name: true,
      subFamilyId: true,
    },
  })
  return Promise.all([
    productFamiliesPromise,
    productSubFamiliesPromise,
    productCapacitiesPromise,
  ])
}

export type ProductFamilySelect = Prisma.ProductFamilyGetPayload<{
  select: { id: true; name: true }
}>
export type ProductSubFamilySelect = Prisma.ProductSubFamilyGetPayload<{
  select: { id: true; name: true; familyId: true }
}>
export type ProductCapacitySelect = Prisma.ProductCapacityGetPayload<{
  select: { id: true; name: true; subFamilyId: true }
}>

export { fetchProductCategoriesSelect }
