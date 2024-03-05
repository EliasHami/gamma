import { type NextPage } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { prisma } from "@/server/db"
import { auth } from "@clerk/nextjs"
import { OFFER_STATUSES, type Offer } from "@prisma/client"

import { formatCurrency } from "@/lib/currency"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DdpPricePerSupplierChart from "@/components/charts/ddp-price-supplier-chart"
import SupplierOfferEvolutionChart from "@/components/charts/supplier-offer-evolution-chart"
import { ErrorCard } from "@/components/error-card"
import { Header } from "@/components/header"
import { Shell } from "@/components/shells/shell"

const getTotalRevenue = (activeOffers: Offer[], currency: string) => {
  // offre(état active).publicPrice - offre(état active).grossPrice
  const totalRevenue = activeOffers.reduce(
    (acc, offer) => acc + (offer.publicPrice - offer.grossPrice),
    0
  )

  return formatCurrency(totalRevenue, currency)
}

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
  const offersPromise = prisma.offer.findMany({
    where: { userId, status: OFFER_STATUSES.ACTIVE },
  })
  const companyPromise = prisma.company.findUnique({ where: { userId } })
  const [suppliers, products, offers, company] = await Promise.all([
    suppliersPromise,
    productsPromise,
    offersPromise,
    companyPromise,
  ])

  if (!company) {
    return (
      <Shell variant="centered">
        <ErrorCard
          title="No settings configured."
          description="Please check settings."
          retryLink="/company"
          retryLinkText="Go to settings"
        />
      </Shell>
    )
  }

  return (
    <Shell>
      <Header title="Dashboard" />
      <Link href="/preview/company">toto</Link>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="size-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getTotalRevenue(offers, company.currency)}
            </div>
            {/* <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p> */}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DdpPricePerSupplierChart products={products} suppliers={suppliers} />
        <SupplierOfferEvolutionChart
          products={products}
          suppliers={suppliers}
        />
      </div>
    </Shell>
  )
}

export default Home
