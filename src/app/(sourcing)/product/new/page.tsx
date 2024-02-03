import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs"

import { fetchProductCategoriesSelect } from "@/lib/product"
import ProductForm from "@/components/forms/add-product-form"

const NewProduct = async () => {
  const { userId } = auth()
  if (!userId) redirect("/signin")
  const [productFamilies, productSubFamilies, productCharacteristics] =
    await fetchProductCategoriesSelect(userId)

  return (
    <ProductForm
      userId={userId}
      productFamilies={productFamilies}
      productSubFamilies={productSubFamilies}
      productCharacteristics={productCharacteristics}
    />
  )
}

export default NewProduct
