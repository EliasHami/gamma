import { COUNTRY, SUPPLIER_STATUSES, YESNO } from "@prisma/client";
import { z } from "zod";

const supplierFormSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  country: z.nativeEnum(COUNTRY),
  validation: z.nativeEnum(YESNO),
  status: z.nativeEnum(SUPPLIER_STATUSES),
});

export default supplierFormSchema;
