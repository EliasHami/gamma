"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs"
import { zact } from "zact/server"
import { z } from "zod"

import { calculateDDPPrice } from "@/lib/currency"

import { productFormSchema } from "../../lib/validations/product"
import { prisma } from "../../server/db"

/* eslint-disable @typescript-eslint/no-unused-vars */
const generateProducts = async () => {
  const { userId } = auth()

  for (const appliance of [
    "Air conditioners",
    "dishwashers",
    "clothes dryers",
    "drying cabinets",
    "freezers",
    "refrigerators",
    "kitchen stoves",
    "water heaters",
    "trash compactors",
    "microwave ovens",
  ]) {
    const dataset = {
      name: appliance,
      userId: userId || "0",
      targetPublicPrice: Math.random() * 1000,
      additionalCost: Math.random() * 50,
      customsTax: Math.random() * 100,
    }
    const prod = await prisma.productNeed.findFirst({
      where: { name: appliance },
    })
    if (prod) {
      await prisma.productNeed.update({
        where: { id: prod.id },
        data: {
          ...prod,
          ...dataset,
        },
      })
    } else {
      const firstprod = await prisma.productNeed.findFirst()
      if (firstprod) {
        const { id, ...fp } = firstprod
        await prisma.productNeed.create({
          data: {
            ...fp,
            ...dataset,
          },
        })
      }
    }
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

const productSchema = productFormSchema.extend({ userId: z.string() })

export async function deleteProduct(id: string) {
  await prisma.productNeed.delete({
    where: { id },
  })
  revalidatePath("/product")
  revalidatePath("/offer")
}

export const createProduct = zact(productSchema)(async (product) => {
  await prisma.productNeed.create({
    data: product,
  })
  revalidatePath("/product")
  revalidatePath("/offer")
})

export const updateProduct = zact(productSchema)(async (product) => {
  await prisma.$transaction(async (tx) => {
    //TODO refactor with getOfferWithPrices

    const updatedProduct = await tx.productNeed.update({
      where: { id: product.id },
      data: product,
      select: { offers: true },
    })
    const companyPromise = tx.company.findUnique({
      where: { userId: product.userId },
    })
    const freightsPromise = tx.freight.findMany({
      where: { userId: product.userId },
    })
    const [company, freights] = await Promise.all([
      companyPromise,
      freightsPromise,
    ])
    if (!company) throw new Error("Company not found")
    await Promise.all(
      updatedProduct.offers.map(async (offer) => {
        const supplier = await tx.supplier.findUnique({
          where: { id: offer.supplierId },
        })

        const ddpPrice = await calculateDDPPrice(
          offer,
          company,
          product,
          freights?.find((freight) => freight.country === supplier?.country)
            ?.price
        )
        const grossPrice = Math.round((ddpPrice / (1 - 0.38)) * 1.2) // TODO get margin from company
        const publicPrice = Math.round(grossPrice / (1 - 0.1))

        return await tx.offer.update({
          where: { id: offer.id },
          data: { ddpPrice, grossPrice, publicPrice },
        })
      })
    )
  })
  // await generateProducts()
  revalidatePath("/product")
  revalidatePath("/offer")
})
