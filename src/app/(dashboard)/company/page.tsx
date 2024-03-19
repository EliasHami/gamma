import { redirect } from "next/navigation"
import { prisma } from "@/server/db"
import { auth } from "@clerk/nextjs"

import Form from "@/components/forms/add-company-form"
import { Header } from "@/components/header"
import { Shell } from "@/components/shells/shell"

export default async function CompanyInfo() {
  const { userId } = auth()
  if (!userId) redirect("/signin")
  const company = await prisma.company.findUnique({ where: { userId } })

  return (
    <Shell>
      <Header title="Settings" description="Manage your account settings" />
      <Form company={company} userId={userId} />
    </Shell>
  )
}
