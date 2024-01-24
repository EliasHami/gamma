"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/server/db"
import { z } from "zod"

import { getPrices } from "@/lib/currency"
import supplierFormSchema from "@/lib/validations/supplier"

export async function deleteSupplier(id: string) {
  await prisma.supplier.delete({
    where: { id },
  })
  revalidatePath("/supplier")
  revalidatePath("/offer")
}

const supplierSchema = supplierFormSchema.extend({ userId: z.string() })

export async function createSupplier(supplier: z.infer<typeof supplierSchema>) {
  const supplierWithSameName = await prisma.supplier.findFirst({
    where: { name: supplier.name },
    select: { id: true },
  })
  if (supplierWithSameName) {
    throw new Error("Supplier with same name already exists")
  }
  await prisma.supplier.create({
    data: supplier,
  })
  revalidatePath("/supplier")
  revalidatePath("/offer")
}

const supplierWithIdSchema = supplierSchema.extend({ id: z.string().cuid() })

export async function updateSupplier(
  supplier: z.infer<typeof supplierWithIdSchema>
) {
  await prisma.$transaction(async (tx) => {
    // TODO not usefull because I await
    //TODO refactor with updateProduct

    const supplierPromise = tx.supplier.update({
      where: { id: supplier.id },
      data: supplier,
      select: { offers: true },
    })
    const companyPromise = tx.company.findUnique({
      where: { userId: supplier.userId },
    })
    const freightsPromise = tx.freight.findMany({
      where: { userId: supplier.userId },
    })
    const [company, freights, updatedSupplier] = await Promise.all([
      // TODO use prisma transcation (and everywhere that we use promise all)
      companyPromise,
      freightsPromise,
      supplierPromise,
    ])
    if (!company) throw new Error("Company not found")
    await Promise.all(
      updatedSupplier.offers.map(async (offer) => {
        const product = await tx.productNeed.findUnique({
          // TODO do this outside in a find many (maybe with transaction ?)
          where: { id: offer.supplierId },
        })

        const { ddpPrice, grossPrice, publicPrice } = await getPrices(
          // TODO outside in a promise.all
          offer,
          company,
          product,
          supplier?.country || null, // TODO use updatedSupplier.country cause it might have changed
          freights
        )

        return tx.offer.update({
          where: { id: offer.id },
          data: { ddpPrice, grossPrice, publicPrice },
        })
      })
    )
  })
  revalidatePath("/supplier")
  revalidatePath("/offer")
}
