"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../server/db";
import { type ProductNeed } from "@prisma/client";

export async function deleteProduct(id: string) {
  try {
    await prisma.productNeed.delete({
      where: { id },
    });
    revalidatePath("/product");
  } catch (error) {
    console.error(error);
  }
}

export async function createProduct(product: ProductNeed) {
  try {
    await prisma.productNeed.create({
      data: product,
    });
    revalidatePath("/product");
  } catch (error) {
    console.error(error);
  }
}

export async function updateProduct(product: ProductNeed) {
  try {
    await prisma.productNeed.update({
      where: { id: product.id },
      data: product,
    });
    revalidatePath("/product");
  } catch (error) {
    console.error(error);
  }
}
