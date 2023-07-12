import dayjs from "dayjs"
import Actions from "@/app/supplier/_components/Actions"
import { prisma } from "@/server/db"
import { getName } from "country-list"

const Supplier = async () => {
  const suppliers = await prisma.supplier.findMany()
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b font-medium dark:border-neutral-500">
                <tr>
                  <th scope="col" className="px-6 py-4">Name</th>
                  <th scope="col" className="px-6 py-4">Country</th>
                  <th scope="col" className="px-6 py-4">Created at</th>
                  <th scope="col" className="px-6 py-4">Updated at</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => {
                  return (
                    <tr key={supplier.id} className="border-b dark:border-neutral-500">
                      <td className="whitespace-nowrap px-6 py-4 font-medium">{supplier.name}</td>
                      <td className="whitespace-nowrap px-6 py-4">{getName(supplier.country)}</td>
                      <td className="whitespace-nowrap px-6 py-4">{dayjs(supplier.createdAt).toString()}</td>
                      <td className="whitespace-nowrap px-6 py-4">{dayjs(supplier.updatedAt).toString()}</td>
                      <td className="whitespace-nowrap px-6 py-4">{supplier.status}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <Actions id={supplier.id} />
                      </td>
                    </tr>
                  )
                }
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Supplier