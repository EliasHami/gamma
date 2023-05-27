import { type GetStaticProps, type NextPage } from "next"
import SupplierForm from "~/components/SupplierForm"

const EditSupplier: NextPage<{ id: string }> = ({ id }) => <SupplierForm id={id} />

export default EditSupplier

import { generateSSGHelper } from '~/server/helpers/ssg'

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const id = context.params?.id;
  if (typeof id !== 'string') throw new Error('no id');

  await ssg.suppliers.getById.prefetch({ id });

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