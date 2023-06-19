"use server";

import { type Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { zact } from "zact/server";
import { z } from "zod";
import { prisma } from "../../server/db";
import resultFormSchema from "./schemas";

export const deleteResult = zact(z.string())(async (id) => {
  await prisma.productResult.delete({
    where: { id },
  });
  revalidatePath("/result");
});

export const createResult = zact(resultFormSchema)(async (result) => {
  await prisma.productResult.create({
    data: { ...result, image: result.image as Prisma.JsonObject }, // https://github.com/prisma/prisma/issues/9247
  });
  revalidatePath("/result");
});

export const updateResult = zact(resultFormSchema)(async (result) => {
  await prisma.productResult.update({
    where: { id: result.id },
    data: { ...result, image: result.image as Prisma.JsonObject },
  });
  revalidatePath("/result");
});
