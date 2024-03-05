import { redirect } from "next/navigation"
import { prisma } from "@/server/db"
import { auth } from "@clerk/nextjs"

import { ErrorCard } from "@/components/error-card"
import { Header } from "@/components/header"
import { Shell } from "@/components/shells/shell"
import SupplierTable from "@/components/tables/supplier-table"

const Supplier = async () => {
  const { userId } = auth()
  if (!userId) redirect("/signin")
  let suppliers = null

  try {
    suppliers = await prisma.supplier.findMany({ where: { userId } })
  } catch (error) {
    console.error(error)
  }

  if (!suppliers) {
    return (
      <Shell variant="centered">
        <ErrorCard
          title="Could not retrieve suppliers."
          description="Please check your connection and try again later."
          retryLink="/suppliers"
          retryLinkText="Retry"
        />
      </Shell>
    )
  }

  return (
    <Shell>
      <Header title="Suppliers" description={`List of suppliers`} />
      <SupplierTable suppliers={suppliers || []} />
    </Shell>
  )
}

export default Supplier
