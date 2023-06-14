"use server";

import { DEPARTMENT, VALIDATION_STATE } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { zact } from "zact/server";
import { z } from "zod";
import { prisma } from "../../server/db";

export const productFormSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  department: z.nativeEnum(DEPARTMENT),
  familyId: z.string().cuid(),
  subFamilyId: z.string().cuid(),
  capacityId: z.string().cuid(),
  color: z.string().nullable(),
  country: z.string(),
  targetPublicPrice: z.number(),
  state: z.nativeEnum(VALIDATION_STATE),
  additionalCost: z.number(),
  customsTax: z.number(),
});

export async function deleteProduct(id: string) {
  await prisma.productNeed.delete({
    where: { id },
  });
  revalidatePath("/product");
}

export const createProduct = zact(productFormSchema)(async (product) => {
  await prisma.productNeed.create({
    data: product,
  });
  revalidatePath("/product");
});

export const updateProduct = zact(productFormSchema)(async (product) => {
  await prisma.productNeed.update({
    where: { id: product.id },
    data: product,
  });
  revalidatePath("/product");
});
