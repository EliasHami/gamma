import ProductForm from "@/components/forms/add-product-form"
import { fetchLibrarySelect } from "../../../lib/product"

const NewProduct = async () => {
  const [productFamilies, productSubFamilies, productCapacities] =
    await fetchLibrarySelect()

  return (
    <ProductForm
      productFamilies={productFamilies}
      productSubFamilies={productSubFamilies}
      productCapacities={productCapacities}
    />
  )
}

export default NewProduct
