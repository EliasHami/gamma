import ProductForm from "~/app/product/_components/Form";
import { prisma } from "~/server/db";

const NewProduct = async () => {
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
      productFamilies={productFamilies}
      productSubFamilies={productSubFamilies}
      productCapacities={productCapacities}
    />)
}

export default NewProduct