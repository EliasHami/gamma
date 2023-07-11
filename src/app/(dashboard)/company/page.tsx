import { prisma } from "@/server/db"
import Form from "./_components/Form"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default async function CompanyInfo() {
  const { userId } = auth()
  if (!userId) redirect("/signin")
  const company = await prisma.company.findUnique({ where: { userId } })

  return (
    <Form company={company} userId={userId} />
  )
}
