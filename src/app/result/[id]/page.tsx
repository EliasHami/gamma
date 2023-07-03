import ProductForm from "~/app/result/_components/Form";
import { fetchSelect } from "../utils";
import { prisma } from "~/server/db";

// https://github.com/vercel/next.js/issues/49408
// export async function generateStaticParams() {
//   const products = await prisma.productResult.findMany()

//   return products.map((product) => ({
//     id: product.id,
//   }));
// }

const EditProductResult = async ({ params: { id } }: { params: { id: string } }) => {
  const resultPromise = prisma.productResult.findUnique({ where: { id } })
  const selectPromises = fetchSelect()
  const [result, [products, suppliers]] = await Promise.all([resultPromise, selectPromises])

  if (!result) return <div>Result not found</div>

  return (
    <ProductForm
      result={result}
      products={products}
      suppliers={suppliers}
    />)
}

export default EditProductResult