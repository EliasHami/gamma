import { auth } from "@clerk/nextjs"
import { prisma } from "~/server/db"
import AddFreight from "./_components/AddFreight"
import { addFreight } from "./actions"
import clsx from "clsx"

const Freight = async () => {
  const { userId } = auth()
  if (!userId) return null
  const freights = await prisma.freight.findMany({
    where: { userId }
  })
  const flexBar = "min-w-full justify-center flex flex-row gap-5"

  return (
    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
        <div className="overflow-hidden">
          <div className="flex flex-col gap-5">
            <div className={flexBar}>
              <h1 className="flex-1 text-2xl font-bold">Country</h1>
              <h1 className="flex-1 text-2xl font-bold">Price</h1>
            </div>
            {freights?.map(({ id, country, price }) => (
              <div key={id} className={clsx(flexBar, "font-light")}>
                <div className="flex-1">{country}</div>
                <div className="flex-1">{price}</div>
              </div>
            ))}
            <AddFreight addFreight={addFreight} className={flexBar} />
            {/* server actions need to be prop drilled to use clerk auth 
             (https://clerk.com/docs/nextjs/server-actions?utm_source=github.com&utm_medium=referral&utm_campaign=none#with-client-components)  */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Freight