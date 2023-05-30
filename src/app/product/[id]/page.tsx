import ProductForm from "~/app/product/_components/Form"
import { prisma } from "~/server/db"

const EditProduct = async ({ params: { id } }: { params: { id: string } }) => {
  const product = await prisma.productNeed.findUnique({ where: { id } })
  if (!product) return <div>Product not found</div>
  const productFamilies = await prisma.productFamily.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  const productSubFamilies = await prisma.productSubFamily.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  const productCapacities = await prisma.productCapacity.findMany({
    select: {
      id: true,
      name: true,
    },
  });
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
