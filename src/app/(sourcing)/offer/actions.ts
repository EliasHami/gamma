"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/server/db"
import { z } from "zod"

import { getPrices } from "@/lib/currency"
import offerFormSchema, { imagesSchema } from "@/lib/validations/offer"

export const deleteOffer = async (id: string) => {
  await prisma.offer.delete({
    where: { id },
  })
  revalidatePath("/offer")
}

const offerWithImagesSchema = offerFormSchema.extend({
  images: imagesSchema,
})
const offerSchema = offerWithImagesSchema.extend({ userId: z.string() })
const offerWithIdSchema = offerWithImagesSchema.extend({
  id: z.string().cuid(),
  userId: z.string(),
})

const getOfferWithPrices = async (offer: z.infer<typeof offerSchema>) => {
  const companyPromise = prisma.company.findUnique({
    where: { userId: offer.userId },
  })
  const freightsPromise = prisma.freight.findMany({
    where: { userId: offer.userId },
  })
  const productPromise = prisma.productNeed.findUnique({
    where: { id: offer.needId },
  })
  const supplierPromise = prisma.supplier.findUnique({
    where: { id: offer.supplierId },
  })
  const [product, supplier, company, freights] = await Promise.all([
    productPromise,
    supplierPromise,
    companyPromise,
    freightsPromise,
  ])
  if (!company) throw new Error("Company not found")
  const { ddpPrice, grossPrice, publicPrice } = await getPrices(
    offer,
    company,
    product,
    supplier?.country || null,
    freights
  )
  return { ...offer, ddpPrice, grossPrice, publicPrice }
}

export const createOffer = async (offer: z.infer<typeof offerSchema>) => {
  await prisma.offer.create({
    data: {
      ...(await getOfferWithPrices(offer)),
    },
  })
  revalidatePath("/offer")
}

export const updateOffer = async (offer: z.infer<typeof offerWithIdSchema>) => {
  await prisma.offer.update({
    where: { id: offer.id },
    data: {
      ...(await getOfferWithPrices(offer)),
    },
  })
  revalidatePath("/offer")
}
