import { COUNTRY, DEPARTMENT, VALIDATION_STATE } from "@prisma/client";
import { z } from "zod";

const productFormSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  department: z.nativeEnum(DEPARTMENT),
  familyId: z.string().cuid(),
  subFamilyId: z.string().cuid(),
  capacityId: z.string().cuid(),
  color: z.string().optional(),
  country: z.nativeEnum(COUNTRY),
  targetPublicPrice: z.number(),
  state: z.nativeEnum(VALIDATION_STATE),
});

export default productFormSchema;
