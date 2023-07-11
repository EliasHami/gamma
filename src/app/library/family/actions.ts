"use server";
import { prisma } from "@/server/db";
import { revalidatePath } from "next/cache";

export async function addFamily(name: string) {
  try {
    const family = await prisma.productFamily.create({
      data: { name },
    });
    revalidatePath("/library/family");
    revalidatePath("/product"); // revalidate only fetch, not working
    return family;
  } catch (error) {
    console.error(error);
  }
}

export const deleteFamily = async (id: string) => {
  await prisma.productFamily.delete({
    where: { id },
  });
  revalidatePath("/library/family");
};

export async function addSubFamily(
  name: string,
  { family }: { family?: string }
) {
  if (!family) {
    throw new Error("Family is required");
  }
  try {
    const subFamily = await prisma.productSubFamily.create({
      data: { name, familyId: family },
    });
    revalidatePath("/library/family");
    revalidatePath("/product"); // revalidate only fetch
    return subFamily;
  } catch (error) {
    console.error(error);
  }
}

export const deleteSubFamily = async (id: string) => {
  await prisma.productSubFamily.delete({
    where: { id },
  });
  revalidatePath("/library/family");
};

export async function addCapacity(
  name: string,
  { subFamily }: { subFamily?: string }
) {
  if (!subFamily) {
    throw new Error("Sub Family is required");
  }
  try {
    const capacity = await prisma.productCapacity.create({
      data: { name, subFamilyId: subFamily },
    });
    revalidatePath("/library/family");
    revalidatePath("product"); // revalidate only fetch
    return capacity;
  } catch (error) {
    console.error(error);
  }
}

export const deleteCapacity = async (id: string) => {
  await prisma.productCapacity.delete({
    where: { id },
  });
  revalidatePath("/library/family");
};
