import SupplierForm from "~/app/supplier/_components/Form";
import { prisma } from "~/server/db";

// TODO : fix this error
//    Unhandled Runtime Error
//    Error: Dynamic server usage: headers
// export async function generateStaticParams() {
//   const products = await prisma.productNeed.findMany()

//   return products.map((product) => ({
//     id: product.id,
//   }));
// }

const EditProduct = async ({ params: { id } }: { params: { id: string } }) => {
  const supplier = await prisma.supplier.findUnique({ where: { id } })

  if (!supplier) return <div>Supplier not found</div>

  return (
    <SupplierForm supplier={supplier} />
  )
}

export default EditProduct