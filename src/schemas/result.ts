import {
  type ProductResult,
  CURRENCIES,
  YESNO,
  RESULT_STATUSES,
} from "@prisma/client";
import { z } from "zod";

type Result = Omit<ProductResult, "id" | "updatedAt" | "createdAt">;

const resultFormSchema: z.ZodSchema<Result> = z.object({
  needId: z.string().cuid(),
  supplierId: z.string().cuid(),
  fobPrice: z.number(),
  currency: z.nativeEnum(CURRENCIES),
  validation: z.nativeEnum(YESNO),
  status: z.nativeEnum(RESULT_STATUSES),
  image: z.object({}), //z.instanceof(File),
});

export default resultFormSchema;
