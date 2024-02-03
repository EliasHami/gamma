import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { prisma } from "@/server/db"
import { auth } from "@clerk/nextjs"

import { Header } from "@/components/header"
import { Shell } from "@/components/shell"
import AddItem from "@/app/(library)/category/_components/AddItem"
import Item from "@/app/(library)/category/_components/Item"
import {
  addCharacteristic,
  addFamily,
  addSubFamily,
  deleteCharacteristic,
  deleteFamily,
  deleteSubFamily,
} from "@/app/(library)/category/actions"

export const metadata: Metadata = {
  title: "Gamma - Categories",
  description: "Categories to organize your products",
}

const Categories = async ({
  searchParams,
}: {
  searchParams: { family: string; subFamily: string }
}) => {
  const { userId } = auth()
  if (!userId) redirect("/signin")
  const family = searchParams.family ?? ""
  const subFamily = searchParams.subFamily ?? ""
  const productFamiliesPromise = prisma.productFamily.findMany({
    where: { userId },
  })
  const productSubFamiliesPromise = prisma.productSubFamily.findMany({
    where: { userId },
  })
  const productCharacteristicsPromise = prisma.productCharacteristic.findMany({
    include: { subFamily: true },
    where: { userId },
  })
  const [productFamilies, productSubFamilies, productCharacteristics] =
    await Promise.all([
      productFamiliesPromise,
      productSubFamiliesPromise,
      productCharacteristicsPromise,
    ])

  return (
    <Shell>
      <Header title="Categories" />
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <div className="flex min-w-full flex-row gap-5 text-left font-light ">
              <div className="flex flex-1 flex-col gap-5 font-medium">
                <h1 className="text-2xl font-bold">Families</h1>
                {productFamilies?.map(({ id, name }) => (
                  <Item
                    key={id}
                    id={id}
                    name={name}
                    searchKey="family"
                    resetKey="subFamily"
                    selected={id === family}
                    deleteAction={deleteFamily}
                  />
                ))}
                <AddItem
                  searchKey="family"
                  action={addFamily}
                  userId={userId}
                />
              </div>
              <div className="flex flex-1 flex-col gap-5 font-medium">
                <h1 className="text-2xl font-bold">Sub Families</h1>
                {productSubFamilies
                  ?.filter(({ familyId }) => familyId === family)
                  .map(({ id, name }) => (
                    <Item
                      key={id}
                      id={id}
                      name={name}
                      searchKey="subFamily"
                      selected={id === subFamily}
                      deleteAction={deleteSubFamily}
                    />
                  ))}
                {family ? (
                  <AddItem
                    searchKey="subFamily"
                    action={addSubFamily}
                    searchParams={searchParams}
                    userId={userId}
                  />
                ) : (
                  <p>Please select a product family</p>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-5 font-medium">
                <h1 className="text-2xl font-bold">Characteristics</h1>
                {productCharacteristics
                  ?.filter(
                    ({ subFamily: sF }) =>
                      sF.id === subFamily && sF.familyId === family
                  )
                  .map(({ id, name }) => (
                    <Item
                      key={id}
                      id={id}
                      name={name}
                      deleteAction={deleteCharacteristic}
                    />
                  ))}
                {subFamily ? (
                  <AddItem
                    action={addCharacteristic}
                    searchParams={searchParams}
                    userId={userId}
                  />
                ) : (
                  <p>Please select a product sub family</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}

export default Categories
