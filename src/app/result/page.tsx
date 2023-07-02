import Link from "next/link"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline"
import { prisma } from "~/server/db"
import Actions from "./_components/Actions"
import { toast } from "react-hot-toast"
import { calculateDDPPrice } from "./actions"

function getCurrencySymbol(locale: string, currency: string) {
  return (0).toLocaleString(
    locale,
    {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }
  ).replace(/\d/g, '').trim()
}

const Product = async () => {
  let results = null

  try {
    results = await prisma.productResult.findMany({
      include: {
        need: true,
        supplier: true,
      },
    });
  } catch (error) {
    toast.error("Could not retrieve results. Please try again later.");
    console.error(error);
  }

  return (
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
                  <th scope="col" className="px-6 py-4">DDP Price</th>
                  <th scope="col" className="px-6 py-4">Gross Price</th>
                  <th scope="col" className="px-6 py-4">Public Price</th>
                  <th scope="col" className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {results?.map(async (result) => {
                  const ddpPrice = await calculateDDPPrice(result, 11, 800,) // todo : try https://www.prisma.io/docs/concepts/components/prisma-client/computed-fields
                  const grossPrice = Math.round((ddpPrice / (1 - 0.38)) * 1.2);
                  const publicPrice = Math.round(grossPrice / (1 - 0.1));
                  const symbol = getCurrencySymbol('en-US', result.currency) // todo : doesnt work
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
                      <td className="whitespace-nowrap px-6 py-4">{JSON.stringify(result.image)}</td>
                      <td className="whitespace-nowrap px-6 py-4">{`${ddpPrice} ${symbol}`}</td>
                      <td className="whitespace-nowrap px-6 py-4">{`${grossPrice} ${symbol}`}</td>
                      <td className="whitespace-nowrap px-6 py-4">{`${publicPrice} ${symbol}`}</td>
                      <td className="whitespace-nowrap px-6 py-4"><Actions id={result.id} /></td>
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

export default Product