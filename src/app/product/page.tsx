import { Header } from "@/components/header"
import { Shell } from "@/components/shell"
import ProductTable from "@/components/tables/product-table"
import { prisma } from "@/server/db"

const Product = async () => {
  let products = null
  try {
    products = await prisma.productNeed.findMany({
      include: {
        family: true,
        subFamily: true,
        capacity: true,
      },
    })
  } catch (error) {
    console.error(error)
  }

  return (
    <Shell>
      <Header title="Products" description={`List of products`} />
      <ProductTable products={products || []} />
    </Shell>
  )
}

export default Product
