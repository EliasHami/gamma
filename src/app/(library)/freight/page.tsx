import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { prisma } from "@/server/db"
import { auth } from "@clerk/nextjs"
import clsx from "clsx"
import { getName } from "country-list"

import { Header } from "@/components/header"
import { Shell } from "@/components/shells/shell"
import AddFreight from "@/app/(library)/freight/_components/AddFreight"
import Delete from "@/app/(library)/freight/_components/Delete"

export const metadata: Metadata = {
  title: "Gamma - Freights",
  description: "Freight rates to calculate the price of your products",
}

const Freight = async () => {
  const { userId } = auth()
  if (!userId) redirect("/signin")
  const freights = await prisma.freight.findMany({
    where: { userId },
  })
  const flexBar = "min-w-full justify-center flex flex-row gap-5"

  return (
    <Shell>
      <Header title="Freights" />
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <div className="flex flex-col gap-5">
              <div className={flexBar}>
                <h1 className="flex-1 text-2xl font-bold">Country</h1>
                <h1 className="flex-1 text-2xl font-bold">Price</h1>
                <h1 className="flex-0">&nbsp;</h1>
              </div>
              {freights?.map(({ id, country, price }) => (
                <div key={id} className={clsx(flexBar, "font-light")}>
                  <div className="flex-1">{getName(country)}</div>
                  <div className="flex-1">{price}</div>
                  <div className="flex-0">{<Delete id={id} />}</div>
                </div>
              ))}
              <AddFreight
                className={flexBar}
                freights={freights}
                userId={userId}
              />
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}

export default Freight
