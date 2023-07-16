"use server"

import { revalidatePath } from "next/cache"
import { zact } from "zact/server"
import { productFormSchema } from "../../lib/validations/product"
import { prisma } from "../../server/db"

export async function deleteProduct(id: string) {
  await prisma.productNeed.delete({
    where: { id },
  })
  revalidatePath("/product")
  revalidatePath("/offer")
}

export const createProduct = zact(productFormSchema)(async (product) => {
  await prisma.productNeed.create({
    data: product,
  })
  revalidatePath("/product")
  revalidatePath("/offer")
})

export const updateProduct = zact(productFormSchema)(async (product) => {
  await prisma.productNeed.update({
    where: { id: product.id },
    data: product,
  })
  revalidatePath("/product")
  revalidatePath("/offer")
})
