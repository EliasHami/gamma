import { redirect } from "next/navigation"
import { prisma } from "@/server/db"
import { auth } from "@clerk/nextjs"

import { fetchProductCategoriesSelect } from "@/lib/product"
import { ErrorCard } from "@/components/error-card"
import { Header } from "@/components/header"
import { Shell } from "@/components/shell"
import ProductTable from "@/components/tables/product-table"

const Product = async () => {
  const { userId } = auth()
  if (!userId) redirect("/signin")
  let products = null
  let company = null
  let productFamilies, productSubFamilies, productCapacities
  try {
    const productsPromise = prisma.productNeed.findMany({
      where: { userId },
      include: {
        family: true,
        subFamily: true,
        capacity: true,
      },
    })
    const companyPromise = prisma.company.findUnique({ where: { userId } })
    const libraryPromises = fetchProductCategoriesSelect(userId)
    const [p, [pF, pSF, pC], c] = await Promise.all([
      productsPromise,
      libraryPromises,
      companyPromise,
    ])
    products = p
    productFamilies = pF
    productSubFamilies = pSF
    productCapacities = pC
    company = c
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

  if (!company) {
    return (
      <Shell variant="centered">
        <ErrorCard
          title="No settings configured."
          description="Please check settings."
          retryLink="/company"
          retryLinkText="Go to settings"
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
        company={company}
      />
    </Shell>
  )
}

export default Product
