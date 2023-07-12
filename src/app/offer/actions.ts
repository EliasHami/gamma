"use server";

import { type Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { zact } from "zact/server";
import { z } from "zod";
import { prisma } from "../../server/db";
import offerFormSchema from "./schemas";

export const deleteOffer = zact(z.string())(async (id) => {
  await prisma.offer.delete({
    where: { id },
  });
  revalidatePath("/offer");
});

export const createOffer = zact(offerFormSchema)(async (offer) => {
  await prisma.offer.create({
    data: { ...offer, image: offer.image as Prisma.JsonObject }, // https://github.com/prisma/prisma/issues/9247
  });
  revalidatePath("/offer");
});

export const updateOffer = zact(offerFormSchema)(async (offer) => {
  await prisma.offer.update({
    where: { id: offer.id },
    data: { ...offer, image: offer.image as Prisma.JsonObject },
  });
  revalidatePath("/offer");
});
