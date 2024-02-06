import {
  CHARACTERISTIC_FIELD_TYPE,
  DEPARTMENT,
  UNIT_OF_MEASURE,
  VALIDATION_STATE,
} from "@prisma/client"
import { z } from "zod"

export const productFormSchema = z.object({
  name: z.string(),
  department: z.nativeEnum(DEPARTMENT),
  familyId: z.string().cuid().nullable(),
  subFamilyId: z.string().cuid().nullable(),
  characteristics: z
    .array(
      z
        .object({
          id: z.string().cuid(),
          value: z.union([z.string(), z.number()]).optional(),
          unit: z.nativeEnum(UNIT_OF_MEASURE).nullable(),
          type: z.nativeEnum(CHARACTERISTIC_FIELD_TYPE),
        })
        .refine(
          (data) =>
            data.type === CHARACTERISTIC_FIELD_TYPE.NUMBER
              ? typeof data.value === "number"
              : true,
          {
            message: "Value must be a number",
            path: ["value"],
          }
        )
    )
    .optional(),
  country: z.string(),
  targetPublicPrice: z.number(),
  state: z.nativeEnum(VALIDATION_STATE),
  additionalCost: z.number(),
  customsTax: z.number(),
})
