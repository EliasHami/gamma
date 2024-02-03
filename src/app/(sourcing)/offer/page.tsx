import { redirect } from "next/navigation"
import { prisma } from "@/server/db"
import { auth } from "@clerk/nextjs"

import { fetchSelect } from "@/lib/offer"
import { catchError } from "@/lib/utils"
import { ErrorCard } from "@/components/error-card"
import { Header } from "@/components/header"
import { Shell } from "@/components/shell"
import OfferTable from "@/components/tables/offer-table"

const Offer = async () => {
  const { userId } = auth()
  if (!userId) redirect("/signin")
  let offers = null
  let company = null
  let products = null
  let suppliers = null
  try {
    const offersPromise = prisma.offer.findMany({
      where: { userId },
      include: {
        need: true,
        supplier: true,
      },
    })
    const companyPromise = await prisma.company.findUnique({
      where: { userId },
    })
    const relationPromises = fetchSelect(userId)
    const [c, o, [p, s]] = await Promise.all([
      companyPromise,
      offersPromise,
      relationPromises,
    ])
    company = c
    products = p
    suppliers = s
    offers = o
  } catch (error) {
    console.error(error)
  }

  if (!offers) {
    return (
      <Shell variant="centered">
        <ErrorCard
          title="Could not retrieve offers."
          description="Please check your connection and try again later."
          retryLink="/offer"
          retryLinkText="Retry"
        />
      </Shell>
    )
  }

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
      <Header title="Offers" description={`List of offers from suppliers`} />
      <OfferTable
        offers={offers}
        company={company}
        products={products || []}
        suppliers={suppliers || []}
      />
    </Shell>
  )
}

export default Offer
