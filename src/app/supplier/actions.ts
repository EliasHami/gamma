"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/server/db"
import { type Supplier } from "@prisma/client"

import { getPrices } from "@/lib/currency"

export async function deleteSupplier(id: string) {
  await prisma.supplier.delete({
    where: { id },
  })
  revalidatePath("/supplier")
  revalidatePath("/offer")
}

export async function createSupplier(supplier: Supplier) {
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

export async function updateSupplier(supplier: Supplier) {
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
