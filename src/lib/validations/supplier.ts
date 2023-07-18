import { SUPPLIER_STATUSES, type Supplier } from "@prisma/client";
import { z } from "zod";

type SupplierForm = Omit<Supplier, "id" | "updatedAt" | "createdAt">;

const supplierFormSchema: z.ZodSchema<SupplierForm> = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  country: z.string(),
  status: z.nativeEnum(SUPPLIER_STATUSES),
});

export default supplierFormSchema;
