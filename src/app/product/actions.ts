"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs"
import { z } from "zod"

import { getPrices } from "@/lib/currency"

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

const productSchema = productFormSchema.extend({ userId: z.string() })

export async function deleteProduct(id: string) {
  await prisma.productNeed.delete({
    where: { id },
  })
  revalidatePath("/product")
  revalidatePath("/offer")
}

export const createProduct = async (product: z.infer<typeof productSchema>) => {
  const productWithSameName = await prisma.productNeed.findFirst({
    where: { name: product.name },
    select: { id: true },
  })
  if (productWithSameName) {
    throw new Error("Product with same name already exists")
  }
  await prisma.productNeed.create({
    data: product,
  })
  revalidatePath("/product")
  revalidatePath("/offer")
}

export const updateProduct = async (product: z.infer<typeof productSchema>) => {
  await prisma.$transaction(async (tx) => {
    //TODO refactor with getOfferWithPrices

    const productPromise = tx.productNeed.update({
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
    const [company, freights, updatedProduct] = await Promise.all([
      companyPromise,
      freightsPromise,
      productPromise,
    ])
    if (!company) throw new Error("Company not found")
    await Promise.all(
      updatedProduct.offers.map(async (offer) => {
        const supplier = await tx.supplier.findUnique({
          where: { id: offer.supplierId },
        })

        const { ddpPrice, grossPrice, publicPrice } = await getPrices(
          offer,
          company,
          product,
          supplier?.country || null,
          freights
        )

        return tx.offer.update({
          where: { id: offer.id },
          data: { ddpPrice, grossPrice, publicPrice },
        })
      })
    )
  })
  // await generateProducts()
  revalidatePath("/product")
  revalidatePath("/offer")
}
