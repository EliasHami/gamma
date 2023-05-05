import { TRPCError } from "@trpc/server";
import { z } from "zod";
import productFormSchema from "~/schemas/product";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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
  createOrUpdate: publicProcedure
    .input(productFormSchema)
    .mutation(async ({ ctx, input }) => {
      let productNeed;
      if (input.id) {
        productNeed = await ctx.prisma.productNeed.update({
          where: { id: input.id },
          data: input,
        });
      } else {
        productNeed = await ctx.prisma.productNeed.create({
          data: input,
        });
      }
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
