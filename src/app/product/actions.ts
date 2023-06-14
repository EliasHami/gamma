"use server";

import { type ProductNeed } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "../../server/db";

export async function deleteProduct(id: string) {
  await prisma.productNeed.delete({
    where: { id },
  });
  revalidatePath("/product");
}

export async function createProduct(product: ProductNeed) {
  await prisma.productNeed.create({
    data: product,
  });
  revalidatePath("/product");
}

export async function updateProduct(product: ProductNeed) {
  await prisma.productNeed.update({
    where: { id: product.id },
    data: product,
  });
  revalidatePath("/product");
}
