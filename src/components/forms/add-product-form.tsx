"use client"

import React, { useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  CHARACTERISTIC_FIELD_TYPE,
  DEPARTMENT,
  VALIDATION_STATE,
  type ProductNeed,
} from "@prisma/client"
import { getData } from "country-list"
import {
  FormProvider,
  useFieldArray,
  useForm,
  type SubmitHandler,
  type UseFormProps,
} from "react-hook-form"
import { toast } from "react-hot-toast"
import type { z } from "zod"

import type {
  ProductCharacteristicSelect,
  ProductFamilySelect,
  ProductSubFamilySelect,
} from "@/lib/product"
import { catchError, UNITS } from "@/lib/utils"
import { productFormSchema } from "@/lib/validations/product"
import Input from "@/components/forms/Input"
import Select from "@/components/forms/Select"
import LoadingSpinner from "@/components/Spinner"
import { createProduct, updateProduct } from "@/app/(sourcing)/product/actions"

type ProductFormProps = {
  product?: ProductNeed
  productFamilies: ProductFamilySelect[]
  productSubFamilies: ProductSubFamilySelect[]
  productCharacteristics: ProductCharacteristicSelect[]
  userId: string
}

type ProductNeedForm = z.infer<typeof productFormSchema>

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  productCharacteristics,
  productFamilies,
  productSubFamilies,
  userId,
}) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const formOptions: UseFormProps<ProductNeedForm> = {
    resolver: zodResolver(productFormSchema),
  }
  if (product) {
    formOptions.defaultValues = product as ProductNeedForm // TODO: fix this : prisma Json car be a string, null, number or boolean
  } else {
    formOptions.defaultValues = {
      familyId: "",
      subFamilyId: "",
      characteristicValues: [],
    }
  }

  const methods = useForm<ProductNeedForm>(formOptions)
  const { handleSubmit, formState, watch, setValue, control } = methods
  const { errors } = formState

  useFieldArray({ control, name: "characteristicValues" })

  const handleCharacteristicsChange = (
    id: string,
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValue(`characteristicValues.${index}`, {
      value: event.target.value,
      id,
    })
  }

  const onSubmit: SubmitHandler<ProductNeedForm> = (data) => {
    startTransition(async () => {
      try {
        product
          ? await updateProduct({
              ...data,
              id: product.id,
              userId,
            })
          : await createProduct({ ...data, userId })
        toast.success("Product submited successfully")
        router.push("/product")
      } catch (error) {
        catchError(error)
      }
    })
  }

  const [
    selectedProductFamily,
    selectedProductSubFamily,
    selectedCharacteristics,
  ] = watch(["familyId", "subFamilyId", "characteristicValues"])

  useEffect(() => {
    if (selectedProductFamily && !selectedProductSubFamily) {
      setValue("subFamilyId", "")
    } else if (
      selectedProductFamily &&
      selectedProductSubFamily &&
      !selectedCharacteristics
    ) {
      setValue("characteristicValues", [])
    }
  }, [
    selectedProductFamily,
    selectedProductSubFamily,
    selectedCharacteristics,
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
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="input"
            >
              Product Characteristics
            </label>
            {productCharacteristics
              ?.filter(
                ({ subFamilyId }) => subFamilyId === selectedProductSubFamily
              )
              .map(({ id, type, name, unit }, index) =>
                type === CHARACTERISTIC_FIELD_TYPE.NUMBER ? (
                  <Input
                    key={id}
                    value={watch(`characteristicValues.${index}.value`)}
                    onChange={(event) =>
                      handleCharacteristicsChange(id, index, event)
                    }
                    className="ml-6"
                    label={`${name} (${unit && UNITS[unit].symbol})`}
                    type="number"
                    error={errors.characteristicValues?.[index]?.value}
                    step="0.01"
                  />
                ) : (
                  <Input
                    key={id}
                    value={watch(`characteristicValues.${index}.value`)}
                    onChange={(event) =>
                      handleCharacteristicsChange(id, index, event)
                    }
                    className="ml-6"
                    label={name}
                    type="text"
                    error={errors.characteristicValues?.[index]?.value}
                  />
                )
              )}
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
