import React from "react"
import { redirect } from "next/navigation"
import { prisma } from "@/server/db"
import { auth } from "@clerk/nextjs"

import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog"
import CompanyForm from "@/components/forms/add-company-form"
import { Header } from "@/components/header"
import { Shell } from "@/components/shells/shell"

const ModalCompany = async () => {
  const { userId } = auth()
  if (!userId) redirect("/signin")
  const company = await prisma.company.findUnique({ where: { userId } })

  return (
    <AlertDialog defaultOpen={true}>
      <AlertDialogContent className="max-w-3xl overflow-hidden p-0">
        <Shell className="flex flex-col gap-2 overflow-visible p-4">
          <Header title="Before we start, we need a few informations" />
          <CompanyForm company={company} userId={userId} />
        </Shell>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ModalCompany
