"use server";

import { prisma } from "@/server/db";
import { revalidatePath } from "next/cache";
import { zact } from "zact/server";
import companyFormSchema from "./shemas";

export const updateOrCreateCompany = zact(companyFormSchema)(
  async (company) => {
    if (!company.id) {
      await prisma.company.create({
        data: { ...company, userId: company.userId || "1" }, // TODO userid shoudnlt be optional in schema, find a way to ignore it in form validation
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
