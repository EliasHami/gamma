"use client"
import LoadingSpinner from "@/components/Spinner"
import Input from "@/components/forms/Input"
import Select from "@/components/forms/Select"
import supplierFormSchema from "@/schemas/supplier"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { SUPPLIER_STATUSES, type Supplier } from "@prisma/client"
import { getData } from "country-list"
import { useRouter } from "next/navigation"
import React, { useTransition } from "react"
import {
  FormProvider,
  useForm,
  type SubmitHandler,
  type UseFormProps,
} from "react-hook-form"
import { toast } from "react-hot-toast"
import { createSupplier, updateSupplier } from "../actions"

const SupplierForm: React.FC<{ supplier?: Supplier }> = ({ supplier }) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const formOptions: UseFormProps<Supplier> = {
    resolver: zodResolver(supplierFormSchema),
  }
  if (supplier) {
    formOptions.defaultValues = supplier
  }

  const methods = useForm<Supplier>(formOptions)
  const { handleSubmit, formState } = methods
  const { errors } = formState

  const onSubmit: SubmitHandler<Supplier> = (data) => {
    supplier
      ? startTransition(() => updateSupplier({ ...data, id: supplier.id }))
      : startTransition(() => createSupplier({ ...data }))
    toast.success("Supplier submited successfully")
    router.push("/supplier")
  }

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
              placeholder="Your supplier"
              error={errors.name}
            />
            <Input
              name="email"
              label="Email"
              type="email"
              placeholder="Your supplier email"
              error={errors.email}
            />
            <Input
              name="phone"
              label="Phone"
              type="tel"
              placeholder="Your supplier phone"
              error={errors.phone}
            />
            <Select name="country" label="Country" error={errors.country}>
              {getData().map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </Select>
            <Select name="status" label="Status" error={errors.status}>
              {Object.entries(SUPPLIER_STATUSES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </Select>
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

export default SupplierForm
