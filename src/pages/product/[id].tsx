import { type GetStaticProps, type NextPage } from "next"
import ProductForm from "~/app/product/ProductForm"

const EditProduct: NextPage<{ id: string }> = ({ id }) => <ProductForm id={id} />

export default EditProduct

import { generateSSGHelper } from '~/server/helpers/ssg'

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