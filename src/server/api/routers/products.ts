import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import {
  COUNTRY,
  DEPARTMENT,
  type ProductNeed,
  VALIDATION_STATE,
} from "@prisma/client";

// const productResultSchema: z.ZodType<ProductResult> = z.object({
//   id: z.string(),
//   needId: z.string().uuid(),
//   supplierId: z.string().uuid(),
//   fobPrice: z.number(),
//   currency: z.nativeEnum(CURRENCIES),
//   validation: z.nativeEnum(YESNO),
//   status: z.nativeEnum(RESULT_STATUSES),
//   image: z.string(),
// });

const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  department: z.nativeEnum(DEPARTMENT),
  familyId: z.string().cuid(),
  subFamilyId: z.string().cuid(),
  capacityId: z.string().cuid(),
  color: z.string(),
  country: z.nativeEnum(COUNTRY),
  targetPublicPrice: z.number(),
  state: z.nativeEnum(VALIDATION_STATE),
});

export type ProductUpdateForm = Omit<
  Exclude<ProductNeed, null>,
  "createdAt" | "updatedAt" | "results"
>;

export type ProductCreateForm = Omit<Exclude<ProductUpdateForm, null>, "id">;

const productCreateSchema: z.ZodType<ProductCreateForm> = productSchema.omit({
  id: true,
});

const productUpdateSchema: z.ZodType<ProductUpdateForm> = productSchema;

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
  update: publicProcedure
    .input(productUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!input.id) throw new TRPCError({ code: "NOT_FOUND" });
      const productNeed = await ctx.prisma.productNeed.update({
        where: { id: input.id },
        data: input,
      });
      return productNeed;
    }),
  create: publicProcedure
    .input(productCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const productNeed = await ctx.prisma.productNeed.create({
        data: input,
      });

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
