import ProductForm from "@/components/forms/add-product-form"
import { fetchProductCategoriesSelect } from "../../../lib/product"

const NewProduct = async () => {
  const [productFamilies, productSubFamilies, productCapacities] =
    await fetchProductCategoriesSelect()

  return (
    <ProductForm
      productFamilies={productFamilies}
      productSubFamilies={productSubFamilies}
      productCapacities={productCapacities}
    />
  )
}

export default NewProduct
