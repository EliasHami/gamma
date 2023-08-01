import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs"

import ProductForm from "@/components/forms/add-product-form"

import { fetchProductCategoriesSelect } from "../../../lib/product"

const NewProduct = async () => {
  const { userId } = auth()
  if (!userId) redirect("/signin")
  const [productFamilies, productSubFamilies, productCapacities] =
    await fetchProductCategoriesSelect(userId)

  return (
    <ProductForm
      userId={userId}
      productFamilies={productFamilies}
      productSubFamilies={productSubFamilies}
      productCapacities={productCapacities}
    />
  )
}

export default NewProduct
