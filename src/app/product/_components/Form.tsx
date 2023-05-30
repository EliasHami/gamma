"use client"
import { COUNTRY, DEPARTMENT, type ProductNeed, VALIDATION_STATE } from "@prisma/client"
import React from "react"
import { type UseFormProps, useForm, type SubmitHandler, FormProvider } from "react-hook-form"
import Input from "~/components/Input"
import Select from "~/components/Select"
import LoadingSpinner from "~/components/Spinner"
import { api } from "~/utils/api"
import { DevTool } from "@hookform/devtools"
import { useRouter } from "next/navigation"
import { toast } from 'react-hot-toast'
import { zodResolver } from "@hookform/resolvers/zod"
import productFormSchema from "~/schemas/product"
import { useQueries } from "@tanstack/react-query"

function fetchProductLibrary(url: string) {
  return async () => {
    const res = await fetch(url)
    return res.json() as Promise<Array<{ id: string, name: string }>> // use trpc when compatible with app
  }
}

const ProductForm: React.FC<{ product?: ProductNeed }> = ({ product }) => {
  const router = useRouter()
  // let title = "New Product Need";
  const formOptions: UseFormProps<ProductNeed> = { resolver: zodResolver(productFormSchema), }
  if (product) {
    formOptions.defaultValues = product
    // title = `Edit ${data?.name ? data.name : "Product Need"}`;
  }

  const methods = useForm<ProductNeed>(formOptions)
  const { handleSubmit, formState } = methods
  const { errors } = formState

  const results = useQueries({ // mauvaise solution car on attends que javascript fasse le rendu et on fetch à chaque render
    queries: [
      { queryKey: ["familyList"], queryFn: fetchProductLibrary("/library/family") },
      { queryKey: ["subFamilyList"], queryFn: fetchProductLibrary("/library/subFamily") },
      { queryKey: ["capacityList"], queryFn: fetchProductLibrary("/library/capacity") },
    ]
  });
  const [{ data: productsFamilies }, { data: productsSubFamilies }, { data: productsCapacities }] = results;

  const ctx = api.useContext();
  const { mutate, isLoading } = api.products.createOrUpdate.useMutation({
    onSuccess: () => {
      router.push("/product")
      void ctx.products.getAll.invalidate();
    },
    onError: () => {
      toast.error("Failed to submit! Please check the form and try again.")
    }
  })

  const onSubmit: SubmitHandler<ProductNeed> = (data) => {
    return product
      ? mutate({ ...data, id: product.id, color: "#000000" })
      : mutate({ ...data, color: "#000000" })
  }

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
              {productsFamilies?.map(({ id, name }) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </Select>
            <Select name="subFamilyId" label="Product Sub Family" error={errors.subFamilyId}>
              {productsSubFamilies?.map(({ id, name }) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </Select>
            <Select name="capacityId" label="Product Capacity" error={errors.capacityId}>
              {productsCapacities?.map(({ id, name }) => (
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
            <button type="submit" className="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              {(formState.isSubmitting || isLoading) && <LoadingSpinner />}
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