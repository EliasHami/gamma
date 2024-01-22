"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/server/db"
import { type z } from "zod"

import type companyFormSchema from "./shemas"

export const updateOrCreateCompany = async (
  company: z.infer<typeof companyFormSchema>
) => {
  if (!company.id) {
    await prisma.company.create({
      data: { ...company, userId: company.userId || "1" }, // TODO userid shoudnlt be optional in schema, find a way to ignore it in form validation
    }) // should be created during registration
  } else {
    await prisma.company.update({
      where: { id: company.id },
      data: { ...company },
    })
  }
  revalidatePath("/company")
  revalidatePath("/offer")
}
