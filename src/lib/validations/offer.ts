import { OFFER_STATUSES, YESNO } from "@prisma/client"
import { z } from "zod"

const offerFormSchema = z.object({
  id: z.string().cuid().optional(),
  needId: z.string().cuid(),
  supplierId: z.string().cuid(),
  fobPrice: z.number(),
  currency: z.string(),
  validation: z.nativeEnum(YESNO),
  status: z.nativeEnum(OFFER_STATUSES),
  image: z.object({}).nullable(), //z.instanceof(File),
  quantityPerContainer: z.number(),
  date: z.date(),
})

export default offerFormSchema
