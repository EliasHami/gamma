import { z } from "zod"

const companyFormSchema = z.object({
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string().email(),
  country: z.string(),
  currency: z.string(),
  insuranceRate: z.number().min(0).max(100),
  bankChargeRate: z.number().min(0).max(100),
  customsRate: z.number().min(0).max(100),
  VATRate: z.number().min(0).max(100),
})

export default companyFormSchema
