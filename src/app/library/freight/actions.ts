"use server";

import { revalidatePath } from "next/cache";
import { zact } from "zact/server";
import { prisma } from "~/server/db";
import { freightFormSchema } from "./schemas";

export const addFreight = zact(freightFormSchema)(async (freight) => {
  await prisma.freight.create({ data: { ...freight, userId: "1" } });
  revalidatePath("/library/freight");
});

export const deleteFreight = async (id: string) => {
  await prisma.freight.delete({
    where: { id },
  });
  revalidatePath("/library/freight");
};
