"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./db";

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
