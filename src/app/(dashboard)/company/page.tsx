import { redirect } from "next/navigation"
import { prisma } from "@/server/db"
import { auth } from "@clerk/nextjs"

import { Header } from "@/components/header"
import { Shell } from "@/components/shell"

import Form from "./_components/Form"

export default async function CompanyInfo() {
  const { userId } = auth()
  if (!userId) redirect("/signin")
  const company = await prisma.company.findUnique({ where: { userId } })

  return (
    <Shell>
      <Header title="Company Info" />
      <Form company={company} userId={userId} />
    </Shell>
  )
}
