import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs"

import { fetchSelect } from "@/lib/offer"
import OfferForm from "@/components/forms/add-offer-form"

const NewProductOffer = async () => {
  const { userId } = auth()
  if (!userId) redirect("/signin")
  const [products, suppliers] = await fetchSelect(userId)

  return <OfferForm products={products} suppliers={suppliers} userId={userId} />
}

export default NewProductOffer
