import { prisma } from "~/server/db"
import Form from "./_components/Form"

export default async function CompanyInfo() {

  const company = await prisma.company.findUnique({ where: { userId: "1" } })

  return (
    <Form company={company} />
  )
}
