"use client"

import React, { useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { DEPARTMENT, VALIDATION_STATE, type ProductNeed } from "@prisma/client"
import { getData } from "country-list"
import {
  FormProvider,
  useForm,
  type SubmitHandler,
  type UseFormProps,
} from "react-hook-form"
import { toast } from "react-hot-toast"

import type {
  ProductCapacitySelect,
  ProductFamilySelect,
  ProductSubFamilySelect,
} from "@/lib/product"
import Input from "@/components/forms/Input"
import Select from "@/components/forms/Select"
import LoadingSpinner from "@/components/Spinner"
import { getErrorMessage } from "@/app/utils"

import { createProduct, updateProduct } from "../../app/product/actions"
import { productFormSchema } from "../../lib/validations/product"

type ProductFormProps = {
  product?: ProductNeed
  productFamilies: ProductFamilySelect[]
  productSubFamilies: ProductSubFamilySelect[]
  productCapacities: ProductCapacitySelect[]
  userId: string
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  productCapacities,
  productFamilies,
  productSubFamilies,
  userId,
}) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const formOptions: UseFormProps<ProductNeed> = {
    resolver: zodResolver(productFormSchema),
  }
  if (product) {
    formOptions.defaultValues = product
  } else {
    formOptions.defaultValues = {
      familyId: "",
      subFamilyId: "",
      capacityId: "",
    }
  }

  const methods = useForm<ProductNeed>(formOptions)
  const { handleSubmit, formState, watch, setValue } = methods
  const { errors } = formState

  const onSubmit: SubmitHandler<ProductNeed> = (data) => {
    startTransition(async () => {
      try {
        product
          ? await updateProduct({ ...data, id: product.id, userId })
          : await createProduct({ ...data, userId })
      } catch (error) {
        toast.error("Error while submitting product. Please try again later.")
        console.error(getErrorMessage(error))
        return
      }
      toast.success("Product submited successfully")
    })
    router.push("/product")
  }

  const [selectedProductFamily, selectedSubProductFamily, selectedCapacityId] =
    watch(["familyId", "subFamilyId", "capacityId"])

  useEffect(() => {
    if (selectedProductFamily && !selectedSubProductFamily) {
      setValue("subFamilyId", "")
    } else if (
      selectedProductFamily &&
      selectedSubProductFamily &&
      !selectedCapacityId
    ) {
      setValue("capacityId", "")
    }
  }, [
    selectedProductFamily,
    selectedSubProductFamily,
    selectedCapacityId,
    setValue,
  ])

  return (
    <>
      <FormProvider {...methods}>
        <form
          id="hook-form"
          className="flex justify-center"
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
        >
          <div className="w-1/2">
            <Input
              name="name"
              label="Name"
              type="text"
              placeholder="Your product need"
              error={errors.name}
            />
            <Select
              name="department"
              label="Department"
              error={errors.department}
            >
              {Object.entries(DEPARTMENT).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </Select>
            <Select
              name="familyId"
              label="Product Family"
              error={errors.familyId}
            >
              {productFamilies?.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </Select>
            <Select
              name="subFamilyId"
              label="Product Sub Family"
              error={errors.subFamilyId}
              disabled={!Boolean(selectedProductFamily)}
            >
              {productSubFamilies
                ?.filter(({ familyId }) => familyId === selectedProductFamily)
                .map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
            </Select>
            <Select
              name="capacityId"
              label="Product Capacity"
              error={errors.capacityId}
              disabled={!Boolean(selectedSubProductFamily)}
            >
              {productCapacities
                ?.filter(
                  ({ subFamilyId }) => subFamilyId === selectedSubProductFamily
                )
                .map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
            </Select>
            <Select name="country" label="Country" error={errors.country}>
              {getData().map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </Select>
            <Input
              name="targetPublicPrice"
              label="Target Public Price"
              type="number"
              placeholder="999.999"
              error={errors.targetPublicPrice}
            />
            <Select name="state" label="State" error={errors.state}>
              {Object.entries(VALIDATION_STATE).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </Select>
            <Input
              name="additionalCost"
              label="Additional Cost"
              type="number"
              placeholder="999.999"
              error={errors.additionalCost}
            />
            <Input
              name="customsTax"
              label="Customs Tax"
              type="number"
              placeholder="999.999"
              error={errors.customsTax}
            />
            <button
              type="submit"
              className="flex w-full items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
            >
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
