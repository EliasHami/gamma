"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../server/db";
import { type Company } from "@prisma/client";

export async function updateCompany(company: Company) {
  try {
    await prisma.company.update({
      where: { id: company.id },
      data: { ...company },
    });
    revalidatePath("/company");
  } catch (error) {
    console.error(error);
  }
}
