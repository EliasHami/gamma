import { ErrorCard } from "@/components/error-card"
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

  if (!products) {
    return (
      <Shell variant="centered">
        <ErrorCard
          title="Could not retrieve offers."
          description="Please check your connection and try again later."
          retryLink="/product"
          retryLinkText="Retry"
        />
      </Shell>
    )
  }

  return (
    <Shell>
      <Header title="Products" description={`List of products`} />
      <ProductTable products={products} />
    </Shell>
  )
}

export default Product
