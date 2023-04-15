import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { productRouter } from "~/server/api/routers/products";
import { supplierRouter } from "./routers/suppliers";
import { productResultRouter } from "./routers/results";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  products: productRouter,
  suppliers: supplierRouter,
  results: productResultRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
