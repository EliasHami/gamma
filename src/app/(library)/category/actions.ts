"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/server/db"

export async function addFamily(name: string, userId: string) {
  const familyWithSameName = await prisma.productFamily.findFirst({
    where: { name: name },
    select: { id: true },
  })
  if (familyWithSameName) {
    throw new Error("Family with same name already exists")
  }
  const family = await prisma.productFamily.create({
    data: { name, userId },
  })
  revalidatePath("/category")
  revalidatePath("/product") // revalidate only fetch, not working
  return family
}

export const deleteFamily = async (id: string) => {
  await prisma.productFamily.delete({
    where: { id },
  })
  revalidatePath("/category")
}

export async function addSubFamily(
  name: string,
  userId: string,
  { family }: { family?: string }
) {
  if (!family) {
    throw new Error("Family is required")
  }
  const subFamilyWithSameName = await prisma.productSubFamily.findFirst({
    where: { name: name },
    select: { id: true },
  })
  if (subFamilyWithSameName) {
    throw new Error("Sub family with same name already exists")
  }
  const subFamily = await prisma.productSubFamily.create({
    data: { name, familyId: family, userId },
  })
  revalidatePath("/category")
  revalidatePath("/product") // revalidate only fetch
  return subFamily
}

export const deleteSubFamily = async (id: string) => {
  await prisma.productSubFamily.delete({
    where: { id },
  })
  revalidatePath("/category")
}

export async function addCapacity(
  name: string,
  userId: string,
  { subFamily }: { subFamily?: string }
) {
  if (!subFamily) {
    throw new Error("Sub Family is required")
  }
  const capacityWithSameName = await prisma.productCapacity.findFirst({
    where: { name: name },
    select: { id: true },
  })
  if (capacityWithSameName) {
    throw new Error("Capacity with same name already exists")
  }
  const capacity = await prisma.productCapacity.create({
    data: { name, subFamilyId: subFamily, userId },
  })
  revalidatePath("/category")
  revalidatePath("product") // revalidate only fetch
  return capacity
}

export const deleteCapacity = async (id: string) => {
  await prisma.productCapacity.delete({
    where: { id },
  })
  revalidatePath("/category")
}
