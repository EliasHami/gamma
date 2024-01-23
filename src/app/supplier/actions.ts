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
  await prisma.supplier.update({
    where: { id: supplier.id },
    data: supplier,
  })
  await prisma.$transaction(async (tx) => {
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
      companyPromise,
      freightsPromise,
      supplierPromise,
    ])
    if (!company) throw new Error("Company not found")
    await Promise.all(
      updatedSupplier.offers.map(async (offer) => {
        const product = await tx.productNeed.findUnique({
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
  revalidatePath("/supplier")
  revalidatePath("/offer")
}
