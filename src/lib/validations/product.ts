import { DEPARTMENT, VALIDATION_STATE } from "@prisma/client"
import { z } from "zod"

export const productFormSchema = z.object({
  name: z.string(),
  department: z.nativeEnum(DEPARTMENT),
  familyId: z.string().cuid().nullable(),
  subFamilyId: z.string().cuid().nullable(),
  characteristicValues: z.array(
    z.object({
      id: z.string().cuid().optional(),
      value: z.union([z.string(), z.number()]).optional(),
    })
  ),
  country: z.string(),
  targetPublicPrice: z.number(),
  state: z.nativeEnum(VALIDATION_STATE),
  additionalCost: z.number(),
  customsTax: z.number(),
})
