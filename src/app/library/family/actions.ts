"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/server/db"

export async function addFamily(name: string, userId: string) {
  try {
    const family = await prisma.productFamily.create({
      data: { name, userId },
    })
    revalidatePath("/library/family")
    revalidatePath("/product") // revalidate only fetch, not working
    return family
  } catch (error) {
    console.error(error)
  }
}

export const deleteFamily = async (id: string) => {
  await prisma.productFamily.delete({
    where: { id },
  })
  revalidatePath("/library/family")
}

export async function addSubFamily(
  name: string,
  userId: string,
  { family }: { family?: string }
) {
  if (!family) {
    throw new Error("Family is required")
  }
  try {
    const subFamily = await prisma.productSubFamily.create({
      data: { name, familyId: family, userId },
    })
    revalidatePath("/library/family")
    revalidatePath("/product") // revalidate only fetch
    return subFamily
  } catch (error) {
    console.error(error)
  }
}

export const deleteSubFamily = async (id: string) => {
  await prisma.productSubFamily.delete({
    where: { id },
  })
  revalidatePath("/library/family")
}

export async function addCapacity(
  name: string,
  userId: string,
  { subFamily }: { subFamily?: string }
) {
  if (!subFamily) {
    throw new Error("Sub Family is required")
  }
  try {
    const capacity = await prisma.productCapacity.create({
      data: { name, subFamilyId: subFamily, userId },
    })
    revalidatePath("/library/family")
    revalidatePath("product") // revalidate only fetch
    return capacity
  } catch (error) {
    console.error(error)
  }
}

export const deleteCapacity = async (id: string) => {
  await prisma.productCapacity.delete({
    where: { id },
  })
  revalidatePath("/library/family")
}
