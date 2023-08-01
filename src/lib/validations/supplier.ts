import { SUPPLIER_STATUSES } from "@prisma/client"
import { z } from "zod"

const supplierFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  country: z.string(),
  status: z.nativeEnum(SUPPLIER_STATUSES),
})

export default supplierFormSchema
