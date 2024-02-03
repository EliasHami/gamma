"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { getPrices } from "@/lib/currency"

import { productFormSchema } from "../../lib/validations/product"
import { prisma } from "../../server/db"

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

const productWithIdSchema = productSchema.extend({ id: z.string().cuid() })

export const updateProduct = async (
  product: z.infer<typeof productWithIdSchema>
) => {
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
  revalidatePath("/product")
  revalidatePath("/offer")
}
