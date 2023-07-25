import { type NextPage } from "next"
import { prisma } from "@/server/db"

import DdpPricePerSupplierChart from "@/components/charts/ddp-price-supplier-chart"
import { Header } from "@/components/header"
import { Shell } from "@/components/shell"

const Home: NextPage = async () => {
  const offersPromise = prisma.offer.findMany({
    include: {
      supplier: true,
    },
  })
  const productsPromise = prisma.productNeed.findMany({
    select: {
      id: true,
      name: true,
    },
  })
  const [offers, products] = await Promise.all([offersPromise, productsPromise])

  return (
    <Shell>
      <Header title="Dashboard" />
      <DdpPricePerSupplierChart products={products} offers={offers} />
    </Shell>
  )
}

export default Home
