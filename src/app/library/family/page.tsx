import { prisma } from "~/server/db";
import AddItem from "~/app/library/_components/AddItem";
import Item from "../_components/Item";
import { addFamily } from "../actions";

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
            <div className="border font-medium dark:border-neutral-500 flex-1 flex flex-col gap-5">
              {productFamilies?.map(({ id, name }) => <Item key={id} id={id} name={name} searchKey="family" />)}
              <AddItem action={addFamily} />
            </div>
            <div className="border font-medium dark:border-neutral-500 flex-1 flex flex-col gap-5">
              {productSubFamilies?.filter(({ familyId }) => familyId === family)
                .map(({ id, name }) => <Item key={id} id={id} name={name} searchKey="subFamily" />)}
            </div>
            <div className="border font-medium dark:border-neutral-500  flex-1 flex flex-col gap-5">
              {productCapacities?.filter(({ subFamily: sF }) => sF.id === subFamily && sF.familyId === family)
                .map(({ id, name }) => <Item key={id} id={id} name={name} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductFamily