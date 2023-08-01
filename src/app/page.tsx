import { type NextPage } from "next"
import { redirect } from "next/navigation"
import { prisma } from "@/server/db"
import { auth } from "@clerk/nextjs"

import DdpPricePerSupplierChart from "@/components/charts/ddp-price-supplier-chart"
import SupplierOfferEvolutionChart from "@/components/charts/supplier-offer-evolution-chart"
import { Header } from "@/components/header"
import { Shell } from "@/components/shell"

const Home: NextPage = async () => {
  const { userId } = auth()
  if (!userId) redirect("/signin")
  const suppliersPromise = prisma.supplier.findMany({ where: { userId } })
  const productsPromise = prisma.productNeed.findMany({
    where: { userId },
    include: {
      offers: true,
    },
  })
  const [suppliers, products] = await Promise.all([
    suppliersPromise,
    productsPromise,
  ])

  return (
    <Shell>
      <Header title="Dashboard" />
      <DdpPricePerSupplierChart products={products} suppliers={suppliers} />
      <SupplierOfferEvolutionChart products={products} suppliers={suppliers} />
    </Shell>
  )
}

export default Home
