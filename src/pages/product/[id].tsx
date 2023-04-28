import { COUNTRY, DEPARTMENT, VALIDATION_STATE } from "@prisma/client"
import { type GetStaticProps, type NextPage } from "next"
import React from "react"
import Input from "~/components/Input"
import Select from "~/components/Select"
import PageLayout from "~/components/pageLayout"

const ProductForm: React.FC<{ id?: string }> = ({ id }) => {
  let data = null;
  let title = "New Product Need";
  if (typeof id == 'string') {
    data = api.products.getById.useQuery({
      id
    }).data;
    title = "Edit Product Need";
  }

  const { data: productsFamilies } = api.productsFamilies.getAll.useQuery();
  const { data: productsSubFamilies } = api.productsSubFamilies.getAll.useQuery();
  const { data: productsCapacities } = api.productsCapacities.getAll.useQuery();
  return (
    <PageLayout noNew title={title}>
      <form className="flex justify-center">
        <div className="w-1/2">
          <Input label="Name" type="text" placeholder="Your product need" />
          <Select label="Department" required>
            {Object.entries(DEPARTMENT).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </Select>
          <Select label="Product Family" required>
            {productsFamilies?.map(({ id, name }) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </Select>
          <Select label="Product Sub Family" required>
            {productsSubFamilies?.map(({ id, name }) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </Select>
          <Select label="Product Capacity" required>
            {productsCapacities?.map(({ id, name }) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </Select>
          <Select label="Country" required>
            {Object.entries(COUNTRY).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </Select>
          <Input label="Target Public Price" type="number" placeholder="999.999" />
          <Select label="State" required>
            {Object.entries(VALIDATION_STATE).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </Select>
          <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </div>
      </form>
    </PageLayout >
  )
}

export { ProductForm }

const EditProduct: NextPage<{ id: string }> = ({ id }) => <ProductForm id={id} />

export default EditProduct

import { generateSSGHelper } from '~/server/helpers/ssg'
import { api } from "~/utils/api"

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const id = context.params?.id;
  if (typeof id !== 'string') throw new Error('no id');

  await ssg.products.getById.prefetch({ id });
  await ssg.productsFamilies.getAll.prefetch();
  await ssg.productsSubFamilies.getAll.prefetch();
  await ssg.productsCapacities.getAll.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id
    }

  }
}

export const getStaticPaths = () => {
  return {
    paths: [], fallback: "blocking"
  }
}