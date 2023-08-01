"use server"

import { revalidatePath } from "next/cache"
import { type Prisma } from "@prisma/client"
import { zact } from "zact/server"
import { z } from "zod"

import { calculateDDPPrice } from "@/lib/currency"

import offerFormSchema from "../../lib/validations/offer"
import { prisma } from "../../server/db"

export const deleteOffer = zact(z.string())(async (id) => {
  await prisma.offer.delete({
    where: { id },
  })
  revalidatePath("/offer")
})

const offerSchema = offerFormSchema.extend({ userId: z.string() })

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
  const supplierPromise = await prisma.company.findUnique({
    where: { id: offer.supplierId },
  })
  const [product, supplier, company, freights] = await Promise.all([
    productPromise,
    supplierPromise,
    companyPromise,
    freightsPromise,
  ])
  if (!company) throw new Error("Company not found")
  const ddpPrice = await calculateDDPPrice(
    offer,
    company,
    product,
    freights?.find((freight) => freight.country === supplier?.country)?.price
  )
  const grossPrice = Math.round((ddpPrice / (1 - 0.38)) * 1.2)  // TODO get margin from company
  const publicPrice = Math.round(grossPrice / (1 - 0.1))
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

export const updateOffer = zact(offerSchema)(async (offer) => {
  await prisma.offer.update({
    where: { id: offer.id },
    data: {
      ...(await getOfferWithPrices(offer)),
      image: offer.image as Prisma.JsonObject,
    },
  })
  revalidatePath("/offer")
})
