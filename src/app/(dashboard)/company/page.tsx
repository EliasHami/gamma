import { redirect } from "next/navigation"
import { prisma } from "@/server/db"
import { auth } from "@clerk/nextjs"

import { Header } from "@/components/header"
import { Shell } from "@/components/shell"
import Form from "@/app/(dashboard)/company/_components/Form"

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
