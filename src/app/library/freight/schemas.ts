import { z } from "zod"

export const freightFormSchema = z.object({
  country: z.string(),
  price: z.number(),
})
