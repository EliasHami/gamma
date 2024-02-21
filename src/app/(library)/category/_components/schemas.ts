import { CHARACTERISTIC_FIELD_TYPE, UNIT_OF_MEASURE } from "@prisma/client"
import { z } from "zod"

export const characteristicFormSchema = z.object({
  name: z.string(),
  type: z.nativeEnum(CHARACTERISTIC_FIELD_TYPE),
  unit: z.nativeEnum(UNIT_OF_MEASURE).optional().nullable(),
})
