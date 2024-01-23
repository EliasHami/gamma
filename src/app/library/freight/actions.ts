"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/server/db"
import { z } from "zod"

import { freightFormSchema } from "./schemas"

const freightSchema = freightFormSchema.extend({ userId: z.string() })

export const addFreight = async (freight: z.infer<typeof freightSchema>) => {
  const freightWithSameCountry = await prisma.productNeed.findFirst({
    where: { country: freight.country },
    select: { id: true },
  })
  if (freightWithSameCountry) {
    throw new Error("Freight with same country already exists")
  }
  await prisma.freight.create({
    data: { ...freight, userId: freight.userId },
  })
  revalidatePath("/library/freight")
}

export const deleteFreight = async (id: string) => {
  await prisma.freight.delete({
    where: { id },
  })
  revalidatePath("/library/freight")
}
