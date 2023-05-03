import { type GetStaticProps, type NextPage } from "next"
import ProductForm from "~/components/ProductForm"

const NewProduct: NextPage = () => <ProductForm />

export default NewProduct

import { generateSSGHelper } from '~/server/helpers/ssg'

export const getStaticProps: GetStaticProps = async () => {
  const ssg = generateSSGHelper();

  await ssg.productsFamilies.getAll.prefetch();
  await ssg.productsSubFamilies.getAll.prefetch();
  await ssg.productsCapacities.getAll.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
    }

  }
}