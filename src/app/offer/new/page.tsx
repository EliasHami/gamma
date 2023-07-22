import ProductForm from "@/app/offer/_components/Form"

import { fetchSelect } from "../../../lib/offer"

const NewProductOffer = async () => {
  const [products, suppliers] = await fetchSelect()

  return <ProductForm products={products} suppliers={suppliers} />
}

export default NewProductOffer
