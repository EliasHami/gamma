"use client"
import { COUNTRY, DEPARTMENT, type ProductNeed, VALIDATION_STATE } from "@prisma/client"
import React, { useTransition } from "react"
import { type UseFormProps, useForm, type SubmitHandler, FormProvider } from "react-hook-form"
import Input from "~/components/Input"
import Select from "~/components/Select"
import LoadingSpinner from "~/components/Spinner"
import { DevTool } from "@hookform/devtools"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import productFormSchema from "~/schemas/product"
import { createProduct, updateProduct } from "../actions"
import { toast } from "react-hot-toast"


type ProductFormProps = {
  product?: ProductNeed
  productFamilies: Array<{
    id: string
    name: string
  }>
  productSubFamilies: Array<{
    id: string
    name: string
    familyId: string
  }>
  productCapacities: Array<{
    id: string
    name: string
    subFamilyId: string
  }>
}

const ProductForm: React.FC<ProductFormProps> = ({ product, productCapacities, productFamilies, productSubFamilies }) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const formOptions: UseFormProps<ProductNeed> = { resolver: zodResolver(productFormSchema), }
  if (product) {
    formOptions.defaultValues = product
  }

  const methods = useForm<ProductNeed>(formOptions)
  const { handleSubmit, formState, watch } = methods
  const { errors } = formState

  const onSubmit: SubmitHandler<ProductNeed> = (data) => {
    product
      ? startTransition(() => updateProduct({ ...data, id: product.id }))
      : startTransition(() => createProduct({ ...data }))
    toast.success("Product submited successfully")
    router.push('/product')
  }

  const [selectedProductFamily, selectedSubProductFamily] = watch(["familyId", "subFamilyId"])

  return (
    <>
      <FormProvider {...methods}>
        <form id="hook-form" className="flex justify-center" onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
          <div className="w-1/2">
            <Input name="name" label="Name" type="text" placeholder="Your product need" error={errors.name} />
            <Select name="department" label="Department" error={errors.department}>
              {Object.entries(DEPARTMENT).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </Select>
            <Select name="familyId" label="Product Family" error={errors.familyId}>
              {productFamilies?.map(({ id, name }) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </Select>
            <Select name="subFamilyId" label="Product Sub Family" error={errors.subFamilyId}>
              {productSubFamilies?.filter(({ familyId }) => familyId === selectedProductFamily)
                .map(({ id, name }) => (
                  <option key={id} value={id}>{name}</option>
                ))}
            </Select>
            <Select name="capacityId" label="Product Capacity" error={errors.capacityId}>
              {productCapacities?.filter(({ subFamilyId }) => subFamilyId === selectedSubProductFamily)
                .map(({ id, name }) => (
                  <option key={id} value={id}>{name}</option>
                ))}
            </Select>
            <Select name="country" label="Country" error={errors.country}>
              {Object.entries(COUNTRY).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </Select>
            <Input name="targetPublicPrice" label="Target Public Price" type="number" placeholder="999.999" error={errors.targetPublicPrice} />
            <Select name="state" label="State" error={errors.state}>
              {Object.entries(VALIDATION_STATE).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </Select>
            <Input type="color" name="color" label="Color" error={errors.color} />
            <button type="submit" className="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              {(formState.isSubmitting || isPending) && <LoadingSpinner />}
              Submit
            </button>
          </div>
        </form>
      </FormProvider>
      <DevTool control={methods.control} /> {/* set up the dev tool */}
    </>
  )
}

export default ProductForm