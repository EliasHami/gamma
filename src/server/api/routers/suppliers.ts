import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const supplierRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.supplier.findMany();
  }),
});
