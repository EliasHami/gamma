"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/server/db"
import { auth } from "@clerk/nextjs"
import { z } from "zod"

import companyFormSchema from "@/app/(dashboard)/company/shemas"

const companySchema = companyFormSchema.extend({
  id: z.string().cuid().optional(),
  userId: z.string(),
})

export const updateOrCreateCompany = async (
  company: z.infer<typeof companySchema>
) => {
  if (!company.id) {
    await prisma.company.create({
      data: { ...company, userId: company.userId },
    }) // TODO should be created during registration : move this action in step 2 of registration
  } else {
    await prisma.company.update({
      where: { id: company.id },
      data: { ...company },
    })
  } // TODO call getPrices and update offers
  revalidatePath("/company")
  revalidatePath("/offer")
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export const generateData = async () => {
  "user server"
  const { userId } = auth()

  for (const appliance of [
    "Air conditioners",
    "dishwashers",
    "clothes dryers",
    "drying cabinets",
    "freezers",
    "refrigerators",
    "kitchen stoves",
    "water heaters",
    "trash compactors",
    "microwave ovens",
  ]) {
    const dataset = {
      name: appliance,
      userId: userId || "0",
      targetPublicPrice: Math.random() * 1000,
      additionalCost: Math.random() * 50,
      customsTax: Math.random() * 100,
    }
    const prod = await prisma.productNeed.findFirst({
      where: { name: appliance },
    })
    if (prod) {
      await prisma.productNeed.update({
        where: { id: prod.id },
        data: {
          ...prod,
          ...dataset,
        },
      })
    } else {
      const firstprod = await prisma.productNeed.findFirst()
      if (firstprod) {
        const { id, ...fp } = firstprod
        await prisma.productNeed.create({
          data: {
            ...fp,
            ...dataset,
          },
        })
      }
    }
  }
}
