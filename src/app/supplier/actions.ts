"use server";

import { prisma } from "@/server/db";
import { type Supplier } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function deleteSupplier(id: string) {
  try {
    await prisma.supplier.delete({
      where: { id },
    });
    revalidatePath("/supplier");
  } catch (error) {
    console.error(error);
  }
}

export async function createSupplier(supplier: Supplier) {
  try {
    await prisma.supplier.create({
      data: supplier,
    });
    revalidatePath("/supplier");
  } catch (error) {
    console.error(error);
  }
}

export async function updateSupplier(supplier: Supplier) {
  try {
    await prisma.supplier.update({
      where: { id: supplier.id },
      data: supplier,
    });
    revalidatePath("/supplier");
  } catch (error) {
    console.error(error);
  }
}
