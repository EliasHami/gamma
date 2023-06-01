"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../server/db";
import { type ProductResult } from "@prisma/client";

export async function deleteResult(id: string) {
  try {
    await prisma.productResult.delete({
      where: { id },
    });
    revalidatePath("/result");
  } catch (error) {
    console.error(error);
  }
}

export async function createResult(result: ProductResult) {
  try {
    await prisma.productResult.create({
      data: result,
    });
    revalidatePath("/result");
  } catch (error) {
    console.error(error);
  }
}

export async function updateResult(result: ProductResult) {
  try {
    await prisma.productResult.update({
      where: { id: result.id },
      data: result,
    });
    revalidatePath("/result");
  } catch (error) {
    console.error(error);
  }
}
