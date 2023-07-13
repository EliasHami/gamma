import { Shell } from "@/components/shell";
import Actions from "./_components/Actions";
import { prisma } from "@/server/db";
import { Header } from "@/components/header";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/app/product/columns";

const Product = async () => {
  let products = null
  try {
    products = await prisma.productNeed.findMany({
      include: {
        family: true,
        subFamily: true,
        capacity: true,
      },
    });
  } catch (error) {
    console.error(error);
  }

  return (
    <>
      <Shell>
        <Header
          title="Products"
          description={`List of products`}
        />
        <DataTable columns={columns} data={products || []} />
      </Shell>
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full text-left text-sm font-light">
                <thead className="border-b font-medium dark:border-neutral-500">
                  <tr>
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
                  {products?.map((product) => {
                    return (
                      <tr key={product.id} className="border-b dark:border-neutral-500">
                        <td className="whitespace-nowrap px-6 py-4">{product.name}</td>
                        <td className="whitespace-nowrap px-6 py-4">{product.department}</td>
                        <td className="whitespace-nowrap px-6 py-4">{product.family.name}</td>
                        <td className="whitespace-nowrap px-6 py-4">{product.subFamily.name}</td>
                        <td className="whitespace-nowrap px-6 py-4">{product.capacity.name}</td>
                        <td className="whitespace-nowrap px-6 py-4">{product.country}</td>
                        <td className="whitespace-nowrap px-6 py-4">{product.targetPublicPrice}</td>
                        <td className="whitespace-nowrap px-6 py-4">{product.state}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <Actions id={product.id} />
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
    </>
  )
}

export default Product