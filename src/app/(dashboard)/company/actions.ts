"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/server/db"
import { z } from "zod"

import companyFormSchema from "./shemas"

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
  }
  revalidatePath("/company")
  revalidatePath("/offer")
}
