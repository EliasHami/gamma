"use client"

import { usePathname, useRouter } from "next/navigation"
import type { Company } from "@prisma/client"

const SettedUp = ({ company }: { company: Company | null }) => {
  const router = useRouter()
  const pathname = usePathname()

  if (!company?.id && pathname !== "/preview/company") {
    router.replace("/preview/company")
  }
  return null
}

export default SettedUp
