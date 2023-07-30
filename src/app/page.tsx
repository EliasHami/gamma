import { type NextPage } from "next"
import { prisma } from "@/server/db"

import DdpPricePerSupplierChart from "@/components/charts/ddp-price-supplier-chart"
import SupplierOfferEvolutionChart from "@/components/charts/supplier-offer-evolution-chart"
import { Header } from "@/components/header"
import { Shell } from "@/components/shell"

const Home: NextPage = async () => {
  const suppliersPromise = prisma.supplier.findMany()
  const productsPromise = prisma.productNeed.findMany({
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
