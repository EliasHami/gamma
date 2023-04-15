import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const productResultRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.productResult.findMany({
      include: {
        need: true,
        supplier: true,
      },
    });
  }),
});
