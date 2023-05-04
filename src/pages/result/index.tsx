import { type NextPage } from "next"
import { api } from "~/utils/api"
import PageLayout from "~/components/pageLayout"
import {LoadingSpinnerPage} from "~/components/Spinner"
import Actions from "~/components/Actions"
import Link from "next/link"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline"

const Product: NextPage = () => {
  const { data, isLoading } = api.results.getAll.useQuery()

  if (isLoading) return <LoadingSpinnerPage />
  if (!data && !isLoading) return <div>Something went wrong</div>

  return (
    <PageLayout>
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full text-left text-sm font-light">
                <thead className="border-b font-medium dark:border-neutral-500">
                  <tr>
                    <th scope="col" className="px-6 py-4">Product</th>
                    <th scope="col" className="px-6 py-4">Supplier</th>
                    <th scope="col" className="px-6 py-4">FOB Price</th>
                    <th scope="col" className="px-6 py-4">Currency</th>
                    <th scope="col" className="px-6 py-4">Validation</th>
                    <th scope="col" className="px-6 py-4">Status</th>
                    <th scope="col" className="px-6 py-4">Image</th>
                    <th scope="col" className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((result) => {
                    return (
                      <tr key={result.id} className="border-b dark:border-neutral-500">
                        <td className="whitespace-nowrap px-6 py-4 font-medium">
                          <Link href={`/product/${result.needId}`} className="flex gap-1 items-center">
                            <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                            <span>{result.need.name}</span>
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <Link href={`/supplier/${result.supplierId}`} className="flex gap-1 items-center" >
                            <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                            <span>{result.supplier.name}</span>
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">{result.fobPrice}</td>
                        <td className="whitespace-nowrap px-6 py-4">{result.currency}</td>
                        <td className="whitespace-nowrap px-6 py-4">{result.validation}</td>
                        <td className="whitespace-nowrap px-6 py-4">{result.status}</td>
                        <td className="whitespace-nowrap px-6 py-4">{result.image}</td>
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

export default Product