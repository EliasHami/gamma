import { prisma } from "~/server/db"
import Form from "./_components/Form"
import { auth } from "@clerk/nextjs"

export default async function CompanyInfo() {
  const { userId } = auth()
  if (!userId) return null // should never happen because this route is protected
  const company = await prisma.company.findUnique({ where: { userId } })

  return (
    <Form company={company} userId={userId} />
  )
}
