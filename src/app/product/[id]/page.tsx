import ProductForm from "@/app/product/_components/Form";
import { prisma } from "@/server/db";
import { fetchLibrarySelect } from "../utils";

// https://github.com/vercel/next.js/issues/49408
// export async function generateStaticParams() {
//   const products = await prisma.productNeed.findMany()

//   return products.map((product) => ({
//     id: product.id,
//   }));
// }

const EditProduct = async ({ params: { id } }: { params: { id: string } }) => {
  const productPromise = prisma.productNeed.findUnique({ where: { id } })
  const libraryPromises = fetchLibrarySelect()
  const [product, [productFamilies, productSubFamilies, productCapacities]] = await Promise.all([productPromise, libraryPromises])

  if (!product) return <div>Product not found</div>

  return (
    <ProductForm
      product={product}
      productFamilies={productFamilies}
      productSubFamilies={productSubFamilies}
      productCapacities={productCapacities}
    />
  )
}

export default EditProduct
