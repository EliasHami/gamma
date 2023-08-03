import { DEPARTMENT, VALIDATION_STATE } from "@prisma/client"
import { z } from "zod"

export const productFormSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  department: z.nativeEnum(DEPARTMENT),
  familyId: z.string().cuid().nullable(),
  subFamilyId: z.string().cuid().nullable(),
  capacityId: z.string().cuid().nullable(),
  country: z.string(),
  targetPublicPrice: z.number(),
  state: z.nativeEnum(VALIDATION_STATE),
  additionalCost: z.number(),
  customsTax: z.number(),
})
