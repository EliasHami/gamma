"use server"

import { revalidatePath } from "next/cache"
import { type Prisma } from "@prisma/client"
import { zact } from "zact/server"
import { z } from "zod"

import { getPrices } from "@/lib/currency"

import offerFormSchema from "../../lib/validations/offer"
import { prisma } from "../../server/db"

export const deleteOffer = zact(z.string())(async (id) => {
  await prisma.offer.delete({
    where: { id },
  })
  revalidatePath("/offer")
})

const offerSchema = offerFormSchema.extend({ userId: z.string() })
const offerWithIdSchema = offerSchema.extend({
  id: z.string().cuid(),
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

export const createOffer = zact(offerSchema)(async (offer) => {
  await prisma.offer.create({
    data: {
      ...(await getOfferWithPrices(offer)),
      image: offer.image as Prisma.JsonObject,
    }, // https://github.com/prisma/prisma/issues/9247
  })
  revalidatePath("/offer")
})

export const updateOffer = zact(offerWithIdSchema)(async (offer) => {
  await prisma.offer.update({
    where: { id: offer.id },
    data: {
      ...(await getOfferWithPrices(offer)),
      image: offer.image as Prisma.JsonObject,
    },
  })
  revalidatePath("/offer")
})
