import {
  COUNTRY, type Company
} from "@prisma/client";
import { z } from "zod";

type CompanyForm = Omit<Company, "id" | "updatedAt" | "createdAt" | "userId">;

const companyFormSchema: z.ZodSchema<CompanyForm> = z.object({
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string().email(),
  country: z.nativeEnum(COUNTRY),
});

export default companyFormSchema;
