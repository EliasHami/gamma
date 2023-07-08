import { prisma } from "~/server/db";
import AddItem from "~/app/library/family/_components/AddItem";
import Item from "./_components/Item";
import { addCapacity, addFamily, addSubFamily, deleteCapacity, deleteFamily, deleteSubFamily } from "./actions";

const ProductFamily = async ({
  searchParams
}: {
  searchParams: { family: string, subFamily: string };
}) => {
  const family = searchParams.family ?? '';
  const subFamily = searchParams.subFamily ?? '';
  const productFamiliesPromise = prisma.productFamily.findMany();
  const productSubFamiliesPromise = prisma.productSubFamily.findMany();
  const productCapacitiesPromise = prisma.productCapacity.findMany({ include: { subFamily: true } });
  const [productFamilies, productSubFamilies, productCapacities] = await Promise.all([productFamiliesPromise, productSubFamiliesPromise, productCapacitiesPromise])

  return (
    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
        <div className="overflow-hidden">
          <div className="min-w-full text-left font-light flex flex-row gap-5 ">
            <div className="font-medium flex-1 flex flex-col gap-5">
              <h1 className="text-2xl font-bold">Families</h1>
              {productFamilies?.map(({ id, name }) => (
                <Item
                  key={id}
                  id={id}
                  name={name}
                  searchKey="family"
                  resetKey="subFamily"
                  selected={id === family}
                  deleteAction={deleteFamily} />
              ))}
              <AddItem searchKey="family" action={addFamily} />
            </div>
            <div className="font-medium flex-1 flex flex-col gap-5">
              <h1 className="text-2xl font-bold">Sub Families</h1>
              {productSubFamilies?.filter(({ familyId }) => familyId === family)
                .map(({ id, name }) => (
                  <Item
                    key={id}
                    id={id}
                    name={name}
                    searchKey="subFamily"
                    selected={id === subFamily}
                    deleteAction={deleteSubFamily} />
                ))}
              {family ? (
                <AddItem searchKey="subFamily" action={addSubFamily} searchParams={searchParams} />
              ) : (
                <p>Please select a product family</p>
              )}
            </div>
            <div className="font-medium flex-1 flex flex-col gap-5">
              <h1 className="text-2xl font-bold">Capacities</h1>
              {productCapacities?.filter(({ subFamily: sF }) => sF.id === subFamily && sF.familyId === family)
                .map(({ id, name }) => (
                  <Item key={id} id={id} name={name} deleteAction={deleteCapacity} />
                ))}
              {subFamily ? (
                <AddItem action={addCapacity} searchParams={searchParams} />
              ) : (
                <p>Please select a product sub family</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductFamily