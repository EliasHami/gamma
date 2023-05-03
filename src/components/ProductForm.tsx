import { COUNTRY, DEPARTMENT, type ProductNeed, VALIDATION_STATE } from "@prisma/client"
import React from "react"
import { type UseFormProps, useForm, SubmitHandler } from "react-hook-form"
import Input from "~/components/Input"
import Select from "~/components/Select"
import LoadingSpinner from "~/components/Spinner"
import PageLayout from "~/components/pageLayout"
import { api } from "~/utils/api"

const ProductForm: React.FC<{ id?: string }> = ({ id }) => {
  let data = null;
  let title = "New Product Need";
  const formOptions: UseFormProps<ProductNeed> = {}
  if (typeof id == 'string') {
    data = api.products.getById.useQuery({
      id
    }).data;
    title = "Edit Product Need";
    formOptions.defaultValues = data;
    console.log(data, formOptions)
  }

  const methods = useForm<ProductNeed>(formOptions)
  const { register, handleSubmit, formState } = methods
  const { errors } = formState

  const { data: productsFamilies } = api.productsFamilies.getAll.useQuery();
  const { data: productsSubFamilies } = api.productsSubFamilies.getAll.useQuery();
  const { data: productsCapacities } = api.productsCapacities.getAll.useQuery();

  const { mutate, isLoading } = api.products.create.useMutation()


  const onSubmit: SubmitHandler<ProductNeed> = (data) => {
    // return id
    //   ? handleCreateProduct(data)
    //   : handleUpdateProduct(construction.id, data)
  }

  return (
    <PageLayout noNew title={title}>
      <form id="hook-form" className="flex justify-center" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-1/2">
          <Input label="Name" type="text" placeholder="Your product need" {...register("name")} />
          <Select label="Department" required {...register("department")} >
            {Object.entries(DEPARTMENT).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </Select>
          <Select label="Product Family" required {...register("familyId")}>
            {productsFamilies?.map(({ id, name }) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </Select>
          <Select label="Product Sub Family" required {...register("subFamilyId")}>
            {productsSubFamilies?.map(({ id, name }) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </Select>
          <Select label="Product Capacity" required {...register("capacityId")}>
            {productsCapacities?.map(({ id, name }) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </Select>
          <Select label="Country" required {...register("country")}>
            {Object.entries(COUNTRY).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </Select>
          <Input label="Target Public Price" type="number" placeholder="999.999" {...register("targetPublicPrice")} />
          <Select label="State" required {...register("state")}>
            {Object.entries(VALIDATION_STATE).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </Select>
          <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            {(formState.isSubmitting || isLoading) && <LoadingSpinner />}
            Submit
          </button>
        </div>
      </form>
    </PageLayout >
  )
}

export default ProductForm