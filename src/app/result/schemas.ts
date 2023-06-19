import { CURRENCIES, RESULT_STATUSES, YESNO } from "@prisma/client";
import { z } from "zod";

const resultFormSchema = z.object({
  id: z.string().cuid().optional(),
  needId: z.string().cuid(),
  supplierId: z.string().cuid(),
  fobPrice: z.number(),
  currency: z.nativeEnum(CURRENCIES),
  validation: z.nativeEnum(YESNO),
  status: z.nativeEnum(RESULT_STATUSES),
  image: z.object({}).nullable(), //z.instanceof(File),
});

export default resultFormSchema;
