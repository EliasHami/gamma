import { OFFER_STATUSES, YESNO } from "@prisma/client"
import { z } from "zod"

const offerFormSchema = z.object({
  needId: z.string().cuid(),
  supplierId: z.string().cuid(),
  fobPrice: z.number(),
  currency: z.string(),
  validation: z.nativeEnum(YESNO),
  status: z.nativeEnum(OFFER_STATUSES),
  images: z
    .unknown()
    .refine((val) => {
      if (!Array.isArray(val)) return false
      if (val.some((file) => !(file instanceof File))) return false
      return true
    }, "Must be an array of File")
    .optional()
    .nullable()
    .default(null),
  quantityPerContainer: z.number(),
  date: z.date(),
})

export const imagesSchema = z.array(
  z.object({
    size: z.number(),
    name: z.string(),
    url: z.string(),
  })
)

export default offerFormSchema
