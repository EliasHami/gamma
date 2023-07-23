import OfferForm from "@/components/forms/add-offer-form"

import { fetchSelect } from "../../../lib/offer"

const NewProductOffer = async () => {
  const [products, suppliers] = await fetchSelect()

  return <OfferForm products={products} suppliers={suppliers} />
}

export default NewProductOffer
