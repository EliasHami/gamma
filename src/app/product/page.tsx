import { prisma } from "@/server/db"

import { fetchProductCategoriesSelect } from "@/lib/product"
import { ErrorCard } from "@/components/error-card"
import { Header } from "@/components/header"
import { Shell } from "@/components/shell"
import ProductTable from "@/components/tables/product-table"

const Product = async () => {
  let products = null
  let productFamilies, productSubFamilies, productCapacities
  try {
    const productsPromise = prisma.productNeed.findMany({
      include: {
        family: true,
        subFamily: true,
        capacity: true,
      },
    })
    const libraryPromises = fetchProductCategoriesSelect()
    const [p, [pF, pSF, pC]] = await Promise.all([
      productsPromise,
      libraryPromises,
    ])
    products = p
    productFamilies = pF
    productSubFamilies = pSF
    productCapacities = pC
  } catch (error) {
    console.error(error)
  }

  if (!products) {
    return (
      <Shell variant="centered">
        <ErrorCard
          title="Could not retrieve products."
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
      <ProductTable
        products={products}
        productFamilies={productFamilies || []}
        productSubFamilies={productSubFamilies || []}
        productCapacities={productCapacities || []}
      />
    </Shell>
  )
}

export default Product
