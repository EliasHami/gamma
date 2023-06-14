import { SUPPLIER_STATUSES, YESNO, type Supplier } from "@prisma/client";
import { z } from "zod";

type SupplierForm = Omit<Supplier, "id" | "updatedAt" | "createdAt">;

const supplierFormSchema: z.ZodSchema<SupplierForm> = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  country: z.string(),
  validation: z.nativeEnum(YESNO),
  status: z.nativeEnum(SUPPLIER_STATUSES),
});

export default supplierFormSchema;
