import { redirect } from "next/navigation"
import { prisma } from "@/server/db"
import { auth } from "@clerk/nextjs"

import SupplierForm from "@/components/forms/add-supplier-form"

// https://github.com/vercel/next.js/issues/49408
// export async function generateStaticParams() {
//   const products = await prisma.supplier.findMany()

//   return products.map((product) => ({
//     id: product.id,
//   }));
// }

const EditProduct = async ({ params: { id } }: { params: { id: string } }) => {
  const { userId } = auth()
  if (!userId) redirect("/signin")
  const supplier = await prisma.supplier.findUnique({ where: { id } })

  if (!supplier) return <div>Supplier not found</div>

  return <SupplierForm userId={userId} supplier={supplier} />
}

export default EditProduct
