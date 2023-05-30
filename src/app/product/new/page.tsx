import ProductForm from "~/app/product/_components/Form";
import { fetchLibrarySelect } from "../utils";

const NewProduct = async () => {
  const [productFamilies, productSubFamilies, productCapacities] = await fetchLibrarySelect()

  return (
    <ProductForm
      productFamilies={productFamilies}
      productSubFamilies={productSubFamilies}
      productCapacities={productCapacities}
    />)
}

export default NewProduct