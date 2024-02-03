import { redirect } from "next/navigation"
import { prisma } from "@/server/db"
import { auth } from "@clerk/nextjs"

import { fetchProductCategoriesSelect } from "@/lib/product"
import ProductForm from "@/components/forms/add-product-form"

// https://github.com/vercel/next.js/issues/49408
// export async function generateStaticParams() {
//   const products = await prisma.productNeed.findMany()

//   return products.map((product) => ({
//     id: product.id,
//   }));
// }

const EditProduct = async ({ params: { id } }: { params: { id: string } }) => {
  const { userId } = auth()
  if (!userId) redirect("/signin")
  const productPromise = prisma.productNeed.findUnique({ where: { id } })
  const libraryPromises = fetchProductCategoriesSelect(userId)
  const [product, [productFamilies, productSubFamilies, productCapacities]] =
    await Promise.all([productPromise, libraryPromises])

  if (!product) return <div>Product not found</div>

  return (
    <ProductForm
      userId={userId}
      product={product}
      productFamilies={productFamilies}
      productSubFamilies={productSubFamilies}
      productCapacities={productCapacities}
    />
  )
}

export default EditProduct
