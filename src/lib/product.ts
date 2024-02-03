import { prisma } from "@/server/db"
import type { Prisma } from "@prisma/client"

const fetchProductCategoriesSelect = (userId: string) => {
  const productFamiliesPromise = prisma.productFamily.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
    },
  })
  const productSubFamiliesPromise = prisma.productSubFamily.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      familyId: true,
    },
  })
  const productCharacteristicsPromise = prisma.productCharacteristic.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      subFamilyId: true,
    },
  })
  return Promise.all([
    productFamiliesPromise,
    productSubFamiliesPromise,
    productCharacteristicsPromise,
  ])
}

export type ProductFamilySelect = Prisma.ProductFamilyGetPayload<{
  select: { id: true; name: true }
}>
export type ProductSubFamilySelect = Prisma.ProductSubFamilyGetPayload<{
  select: { id: true; name: true; familyId: true }
}>
export type ProductCharacteristicSelect =
  Prisma.ProductCharacteristicGetPayload<{
    select: { id: true; name: true; subFamilyId: true }
  }>

export { fetchProductCategoriesSelect }
