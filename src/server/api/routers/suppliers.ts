import { TRPCError } from "@trpc/server";
import { z } from "zod";
import supplierFormSchema from "~/schemas/supplier";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const supplierRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.supplier.findMany();
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const supplier = await ctx.prisma.supplier.findUnique({
        where: { id: input.id },
      });

      if (!supplier) throw new TRPCError({ code: "NOT_FOUND" });

      return supplier;
    }),
  createOrUpdate: publicProcedure
    .input(supplierFormSchema)
    .mutation(async ({ ctx, input }) => {
      let supplier;
      if (input.id) {
        supplier = await ctx.prisma.supplier.update({
          where: { id: input.id },
          data: input,
        });
      } else {
        supplier = await ctx.prisma.supplier.create({
          data: input,
        });
      }
      return supplier;
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const supplier = await ctx.prisma.supplier.delete({
        where: { id: input.id },
      });
      return supplier;
    }),
});
