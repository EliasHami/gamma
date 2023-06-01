import ProductForm from "~/app/result/_components/Form";
import { fetchSelect } from "../utils";

const NewProductResult = async () => {
  const [products, suppliers] = await fetchSelect()

  return (
    <ProductForm
      products={products}
      suppliers={suppliers}
    />)
}

export default NewProductResult