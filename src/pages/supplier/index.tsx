import { type NextPage } from "next"
import { api } from "~/utils/api"
import PageLayout from "~/components/pageLayout"
import LoadingSpinner from "~/components/Spinner"
import dayjs from "dayjs"
import Actions from "~/components/Actions"

const Supplier: NextPage = () => {
  const { data, isLoading } = api.suppliers.getAll.useQuery()

  if (isLoading) return <LoadingSpinner />
  if (!data) return <div>Something went wrong</div>

  return (
    <PageLayout>
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
                    <th scope="col" className="px-6 py-4">Validation Status</th>
                    <th scope="col" className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((supplier) => {
                    return (
                      <tr key={supplier.id} className="border-b dark:border-neutral-500">
                        <td className="whitespace-nowrap px-6 py-4 font-medium">{supplier.name}</td>
                        <td className="whitespace-nowrap px-6 py-4">{supplier.country}</td>
                        <td className="whitespace-nowrap px-6 py-4">{dayjs(supplier.createdAt).toString()}</td>
                        <td className="whitespace-nowrap px-6 py-4">{dayjs(supplier.updatedAt).toString()}</td>
                        <td className="whitespace-nowrap px-6 py-4">{supplier.validation}</td>
                        <td className="whitespace-nowrap px-6 py-4">{supplier.status}</td>
                        <td className="whitespace-nowrap px-6 py-4"><Actions /></td>
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
    </PageLayout>
  )
}

export default Supplier