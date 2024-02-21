"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/server/db"
import type { z } from "zod"

import type { characteristicFormSchema } from "@/app/(library)/category/_components/schemas"

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

export async function addCharacteristic(
  characteristic: z.infer<typeof characteristicFormSchema>,
  userId: string,
  subFamilyId: string
) {
  if (!subFamilyId) {
    throw new Error("Sub Family is required")
  }
  const characteristicWithSameName =
    await prisma.productCharacteristic.findFirst({
      where: { name: characteristic.name },
      select: { id: true },
    })
  if (characteristicWithSameName) {
    throw new Error("Characteristic with same name already exists")
  }
  await prisma.productCharacteristic.create({
    data: { ...characteristic, subFamilyId, userId },
  })
  revalidatePath("/category")
  revalidatePath("product") // revalidate only fetch
}

export const deleteCharacteristic = async (id: string) => {
  // TODO : delete all values of this characteristic in products
  await prisma.productCharacteristic.delete({
    where: { id },
  })
  revalidatePath("/category")
}
