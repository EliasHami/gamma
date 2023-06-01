"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../server/db";
import { type Prisma, type ProductResult } from "@prisma/client";

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
      data: { ...result, image: result.image as Prisma.JsonObject }, // https://github.com/prisma/prisma/issues/9247
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
      data: { ...result, image: result.image as Prisma.JsonObject },
    });
    revalidatePath("/result");
  } catch (error) {
    console.error(error);
  }
}
