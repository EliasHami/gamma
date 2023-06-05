"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "~/server/db";

export async function addFamily(name: string) {
  try {
    await prisma.productFamily.create({
      data: { name },
    });
    revalidatePath("/library/family");
  } catch (error) {
    console.error(error);
  }
}

export async function addSubFamily(
  name: string,
  { familyId }: { familyId?: string }
) {
  if (!familyId) {
    throw new Error("Family is required");
  }
  try {
    await prisma.productSubFamily.create({
      data: { name, familyId },
    });
    revalidatePath("/library/family");
  } catch (error) {
    console.error(error);
  }
}

export async function addCapacity(
  name: string,
  { subFamilyId }: { subFamilyId?: string }
) {
  if (!subFamilyId) {
    throw new Error("Sub Family is required");
  }
  try {
    await prisma.productCapacity.create({
      data: { name, subFamilyId },
    });
    revalidatePath("/library/family");
  } catch (error) {
    console.error(error);
  }
}
