"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/server/db"
import { type z } from "zod"

import type { freightFormSchema } from "./schemas"

export const addFreight = async (
  freight: z.infer<typeof freightFormSchema>
) => {
  const freightWithSameCountry = await prisma.productNeed.findFirst({
    where: { country: freight.country },
    select: { id: true },
  })
  if (freightWithSameCountry) {
    throw new Error("Freight with same country already exists")
  }
  await prisma.freight.create({
    data: { ...freight, userId: freight.userId || "1" },
  }) // TODO userid shoudnlt be optional in schema, find a way to ignore it in form validation
  revalidatePath("/library/freight")
}

export const deleteFreight = async (id: string) => {
  await prisma.freight.delete({
    where: { id },
  })
  revalidatePath("/library/freight")
}
