import { CURRENCIES, OFFER_STATUSES, YESNO } from "@prisma/client";
import { z } from "zod";

const offerFormSchema = z.object({
  id: z.string().cuid().optional(),
  needId: z.string().cuid(),
  supplierId: z.string().cuid(),
  fobPrice: z.number(),
  currency: z.nativeEnum(CURRENCIES),
  validation: z.nativeEnum(YESNO),
  status: z.nativeEnum(OFFER_STATUSES),
  image: z.object({}).nullable(), //z.instanceof(File),
  quantityPerContainer: z.number(),
});

export default offerFormSchema;
