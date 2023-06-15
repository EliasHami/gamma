"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { zact } from "zact/server";
import { prisma } from "~/server/db";
import { freightFormSchema } from "./schemas";

export const addFreight = zact(freightFormSchema)(async (freight) => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("You must be signed in to add an item.");
  }

  await prisma.freight.create({ data: { ...freight, userId } });
  revalidatePath("/library/freight");
});
