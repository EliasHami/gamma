import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// import { ProductNeed } from '@prisma/client'
// import z from 'zod'

// const ProductSchema : z.ZodType<ProductNeed>= z.object({
//   id : z.string(),
//   createdAt z.string(),
//   updatedAt z.string()
//   name      z.string()
//   department DEPARTMENT
//   family   ProductFamily @relation(fields: [familyId], references: [id])
//   familyId String
//   subFamily   ProductSubFamily @relation(fields: [subFamilyId], references: [id])
//   subFamilyId String
//   capacity   ProductCapacity @relation(fields: [capacityId], references: [id])
//   capacityId String
//   color     String
//   country  COUNTRY
//   targetPublicPrice Float
//   state    VALIDATION_STATE
//   results   ProductResult[]
// })

export const productRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.productNeed.findMany({
      include: {
        family: true,
        subFamily: true,
        capacity: true,
      },
    });
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const productNeed = await ctx.prisma.productNeed.findUnique({
        where: { id: input.id },
      });

      if (!productNeed) throw new TRPCError({ code: "NOT_FOUND" });

      return productNeed;
    }),
});

export const productFamilyRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.productFamily.findMany();
  }),
});

export const productSubFamilyRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.productSubFamily.findMany();
  }),
});

export const productCapacityRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.productCapacity.findMany();
  }),
});
