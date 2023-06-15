"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import React, { useTransition } from "react"
import { FormProvider, type SubmitHandler, type UseFormProps, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import Input from "~/components/Input"
import LoadingSpinner from "~/components/Spinner"
import { getErrorMessage } from "~/app/utils"
import { freightFormSchema } from "../schemas"

type FreightForm = {
  country: string
  price: number
}

type AddFreightProps = {
  addFreight: (data: FreightForm) => Promise<void>
}

const AddFreight: React.FC<AddFreightProps> = ({ addFreight }) => {
  const [isPending, startTransition] = useTransition()
  const formOptions: UseFormProps<FreightForm> = { resolver: zodResolver(freightFormSchema), }

  const methods = useForm<FreightForm>(formOptions)
  const { handleSubmit, formState, setValue } = methods
  const onSubmit: SubmitHandler<FreightForm> = (data) => {
    startTransition(async () => {
      try {
        await addFreight(data)
        setValue("country", "")
        setValue("price", 0)
      } catch (e) {
        toast.error("Error adding freight. Please try again later.")
        console.error(getErrorMessage(e))
        return
      }
      toast.success("Freight added successfully.")
    })
  }

  return (
    <FormProvider {...methods}>
      <form className="min-w-full items-center justify-center font-light flex flex-row gap-5" onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
        <Input className="flex-1" name="country" type="text" placeholder="Country" error={formState.errors.country} />
        <Input className="flex-1" name="price" type="number" placeholder="Price" error={formState.errors.price} />
        <button
          type="submit"
          className={clsx(
            "h-[50px] w-full sm:w-auto px-5 py-2.5",
            "flex items-center text-center",
            "text-white bg-blue-700 hover:bg-blue-800",
            "dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
            "focus:ring-4 focus:outline-none focus:ring-blue-300",
            "rounded-lg text-sm font-medium")}>
          {(formState.isSubmitting || isPending) && <LoadingSpinner />}
          Add
        </button>
      </form>
    </FormProvider>
  )
}

export default AddFreight