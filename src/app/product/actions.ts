"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs"
import { zact } from "zact/server"
import { z } from "zod"

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
  await prisma.productNeed.update({
    where: { id: product.id },
    data: product,
  })
  // await generateProducts()
  revalidatePath("/product")
  revalidatePath("/offer")
})
