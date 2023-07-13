import { prisma } from "@/server/db"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import Form from "./_components/Form"

export default async function CompanyInfo() {
  const { userId } = auth()
  if (!userId) redirect("/signin")
  const company = await prisma.company.findUnique({ where: { userId } })

  return <Form company={company} userId={userId} />
}
