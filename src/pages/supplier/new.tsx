import { type GetStaticProps, type NextPage } from "next"
import SupplierForm from "~/components/SupplierForm"

const NewSupplier: NextPage = () => <SupplierForm />

export default NewSupplier

import { generateSSGHelper } from '~/server/helpers/ssg'

export const getStaticProps: GetStaticProps = () => {
  const ssg = generateSSGHelper();

  return {
    props: {
      trpcState: ssg.dehydrate(),
    }

  }
}