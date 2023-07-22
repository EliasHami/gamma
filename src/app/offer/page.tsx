import { redirect } from "next/navigation"
import { prisma } from "@/server/db"
import { auth } from "@clerk/nextjs"

import { calculateDDPPrice } from "@/lib/currency"
import { fetchSelect } from "@/lib/offer"
import { getErrorMessage } from "@/lib/utils"
import { ErrorCard } from "@/components/error-card"
import { Header } from "@/components/header"
import { Shell } from "@/components/shell"
import OfferTable from "@/components/tables/offer-table"

const Offer = async () => {
  const { userId } = auth()
  if (!userId) redirect("/signin")
  let offers = null
  let products = null
  let suppliers = null

  try {
    const companyPromise = prisma.company.findUnique({ where: { userId } })
    const offersPromise = prisma.offer.findMany({
      include: {
        need: true,
        supplier: true,
      },
    })
    const freightsPromise = prisma.freight.findMany({
      where: { userId },
    })
    const relationPromises = fetchSelect()
    const [company, o, freights, [p, s]] = await Promise.all([
      companyPromise,
      offersPromise,
      freightsPromise,
      relationPromises,
    ])
    products = p
    suppliers = s

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

    offers = await Promise.all(
      o?.map(async (offer) => ({
        ...offer,
        ddpPrice: await calculateDDPPrice(
          offer,
          company,
          freights?.find(
            (freight) => freight.country === offer.supplier.country
          )?.price
        ),
      }))
    )
  } catch (error) {
    console.error(getErrorMessage(error))
  }

  if (!offers) {
    return (
      <Shell variant="centered">
        <ErrorCard
          title="Could not retrieve offers."
          description="Please check your connection and try again later."
          retryLink="/offers"
          retryLinkText="Retry"
        />
      </Shell>
    )
  }

  return (
    <Shell>
      <Header title="Products" description={`List of products`} />
      <OfferTable
        offers={offers}
        products={products || []}
        suppliers={suppliers || []}
      />
    </Shell>
  )
}

export default Offer
