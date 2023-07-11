import ProductForm from "@/app/offer/_components/Form";
import { fetchSelect } from "../utils";
import { prisma } from "@/server/db";

// https://github.com/vercel/next.js/issues/49408
// export async function generateStaticParams() {
//   const products = await prisma.productResult.findMany()

//   return products.map((product) => ({
//     id: product.id,
//   }));
// }

const EditProductOffer = async ({ params: { id } }: { params: { id: string } }) => {
  const offerPromise = prisma.offer.findUnique({ where: { id } })
  const selectPromises = fetchSelect()
  const [offer, [products, suppliers]] = await Promise.all([offerPromise, selectPromises])

  if (!offer) return <div>Offer not found</div>

  return (
    <ProductForm
      offer={offer}
      products={products}
      suppliers={suppliers}
    />)
}

export default EditProductOffer