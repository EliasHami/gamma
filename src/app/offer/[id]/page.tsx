import { prisma } from "@/server/db"

import OfferForm from "@/components/forms/add-offer-form"

import { fetchSelect } from "../../../lib/offer"

// https://github.com/vercel/next.js/issues/49408
// export async function generateStaticParams() {
//   const products = await prisma.productResult.findMany()

//   return products.map((product) => ({
//     id: product.id,
//   }));
// }

const EditProductOffer = async ({
  params: { id },
}: {
  params: { id: string }
}) => {
  const offerPromise = prisma.offer.findUnique({ where: { id } })
  const selectPromises = fetchSelect()
  const [offer, [products, suppliers]] = await Promise.all([
    offerPromise,
    selectPromises,
  ])

  if (!offer) return <div>Offer not found</div>

  return <OfferForm offer={offer} products={products} suppliers={suppliers} />
}

export default EditProductOffer
