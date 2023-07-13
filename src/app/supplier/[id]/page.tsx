import SupplierForm from "@/app/supplier/_components/Form"
import { prisma } from "@/server/db"

// https://github.com/vercel/next.js/issues/49408
// export async function generateStaticParams() {
//   const products = await prisma.supplier.findMany()

//   return products.map((product) => ({
//     id: product.id,
//   }));
// }

const EditProduct = async ({ params: { id } }: { params: { id: string } }) => {
  const supplier = await prisma.supplier.findUnique({ where: { id } })

  if (!supplier) return <div>Supplier not found</div>

  return <SupplierForm supplier={supplier} />
}

export default EditProduct
