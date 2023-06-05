"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "~/server/db";

export type AddItemForm = {
  name: string;
};

export async function addItem(item: AddItemForm) {
  try {
    await prisma.productFamily.create({
      data: item,
    });
    revalidatePath("/library");
  } catch (error) {
    console.error(error);
  }
}
