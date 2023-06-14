import { DEPARTMENT, VALIDATION_STATE, type ProductNeed } from "@prisma/client";
import { z } from "zod";

type Product = Omit<ProductNeed, "id" | "updatedAt" | "createdAt">;

const productFormSchema: z.ZodSchema<Product> = z.object({
  name: z.string(),
  department: z.nativeEnum(DEPARTMENT),
  familyId: z.string().cuid(),
  subFamilyId: z.string().cuid(),
  capacityId: z.string().cuid(),
  color: z.string(),
  country: z.string(),
  targetPublicPrice: z.number(),
  state: z.nativeEnum(VALIDATION_STATE),
});

export default productFormSchema;
