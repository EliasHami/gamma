"use server";

import { revalidatePath } from "next/cache";
import { zact } from "zact/server";
import { prisma } from "../../server/db";
import companyFormSchema from "./shemas";

export const updateOrCreateCompany = zact(companyFormSchema)(
  async (company) => {
    if (!company.id) {
      await prisma.company.create({
        data: { ...company, userId: company.userId || "1" },
      }); // should be created during registration
    } else {
      await prisma.company.update({
        where: { id: company.id },
        data: { ...company },
      });
    }
    revalidatePath("/company");
    revalidatePath("/offer");
  }
);
