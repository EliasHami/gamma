"use server";

import { prisma } from "@/server/db";
import { revalidatePath } from "next/cache";
import { zact } from "zact/server";
import { freightFormSchema } from "./schemas";

export const addFreight = zact(freightFormSchema)(async (freight) => {
  await prisma.freight.create({
    data: { ...freight, userId: freight.userId || "1" },
  }); // TODO userid shoudnlt be optional in schema, find a way to ignore it in form validation
  revalidatePath("/library/freight");
});

export const deleteFreight = async (id: string) => {
  await prisma.freight.delete({
    where: { id },
  });
  revalidatePath("/library/freight");
};
