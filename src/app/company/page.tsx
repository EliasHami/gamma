import { auth } from "@clerk/nextjs"
import { prisma } from "~/server/db"
import Form from "./_components/Form"

export default async function CompanyInfo() {
  const { userId } = auth()
  if (!userId) return null
  const company = await prisma.company.findUnique({ where: { userId } })

  return (
    <Form company={company} />
  )
}
