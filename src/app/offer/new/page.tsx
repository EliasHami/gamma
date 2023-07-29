import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs"

import OfferForm from "@/components/forms/add-offer-form"

import { fetchSelect } from "../../../lib/offer"

const NewProductOffer = async () => {
  const { userId } = auth()
  if (!userId) redirect("/signin")
  const [products, suppliers] = await fetchSelect()

  return <OfferForm products={products} suppliers={suppliers} userId={userId} />
}

export default NewProductOffer
