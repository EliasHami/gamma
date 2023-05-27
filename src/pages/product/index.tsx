import { type NextPage } from "next"
import { api } from "~/utils/api"
import PageLayout from "~/components/pageLayout"
import { LoadingSpinnerPage } from "~/components/Spinner"
import Actions from "~/components/Actions"
import { useRouter } from "next/router"
import { toast } from "react-hot-toast"

const Product: NextPage = () => {
  const { data, isLoading } = api.products.getAll.useQuery()
  const router = useRouter()
  const ctx = api.useContext();
  const { mutate, isLoading: isDeleting } = api.products.delete.useMutation({
    onSuccess: async () => {
      await router.push("/product")
      void ctx.products.getAll.invalidate();
    },
    onError: () => {
      toast.error("Failed to submit! Please check the form and try again.")
    }
  })

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
                    <th scope="col" className="px-6 py-4">#</th>
                    <th scope="col" className="px-6 py-4">Name</th>
                    <th scope="col" className="px-6 py-4">Department</th>
                    <th scope="col" className="px-6 py-4">Family</th>
                    <th scope="col" className="px-6 py-4">Sub-Family</th>
                    <th scope="col" className="px-6 py-4">Capacity</th>
                    <th scope="col" className="px-6 py-4">Color</th>
                    <th scope="col" className="px-6 py-4">Country</th>
                    <th scope="col" className="px-6 py-4">Target Public price</th>
                    <th scope="col" className="px-6 py-4">State</th>
                    <th scope="col" className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((product) => {
                    return (
                      <tr key={product.id} className="border-b dark:border-neutral-500">
                        <td className="whitespace-nowrap px-6 py-4 font-medium">{product.id}</td>
                        <td className="whitespace-nowrap px-6 py-4">{product.name}</td>
                        <td className="whitespace-nowrap px-6 py-4">{product.department}</td>
                        <td className="whitespace-nowrap px-6 py-4">{product.family.name}</td>
                        <td className="whitespace-nowrap px-6 py-4">{product.subFamily.name}</td>
                        <td className="whitespace-nowrap px-6 py-4">{product.capacity.name}</td>
                        <td className="whitespace-nowrap px-6 py-4">{product.color}</td>
                        <td className="whitespace-nowrap px-6 py-4">{product.country}</td>
                        <td className="whitespace-nowrap px-6 py-4">{product.targetPublicPrice}</td>
                        <td className="whitespace-nowrap px-6 py-4">{product.state}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <Actions
                            disabled={isDeleting}
                            onEdit={() => void router.push(`product/${product.id}`)}
                            onDelete={() => void mutate({ id: product.id })}
                          />
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
    </PageLayout>
  )
}

export default Product