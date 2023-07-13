"use client"

import { getErrorMessage } from "@/app/utils"
import LoadingSpinner from "@/components/Spinner"
import Input from "@/components/forms/Input"
import Select from "@/components/forms/Select"
import { zodResolver } from "@hookform/resolvers/zod"
import { type Freight } from "@prisma/client"
import clsx from "clsx"
import { getData } from "country-list"
import React, { useTransition } from "react"
import {
  FormProvider,
  useForm,
  type SubmitHandler,
  type UseFormProps,
} from "react-hook-form"
import { toast } from "react-hot-toast"
import { addFreight } from "../actions"
import { freightFormSchema } from "../schemas"

type FreightForm = {
  country: string
  price: number
}

type AddFreightProps = {
  className?: string
  freights: Freight[]
  userId: string
}

const AddFreight: React.FC<AddFreightProps> = ({
  className,
  freights,
  userId,
}) => {
  const [isPending, startTransition] = useTransition()
  const formOptions: UseFormProps<FreightForm> = {
    resolver: zodResolver(freightFormSchema),
  }

  const methods = useForm<FreightForm>(formOptions)
  const { handleSubmit, formState, setValue } = methods
  const onSubmit: SubmitHandler<FreightForm> = (data) => {
    startTransition(async () => {
      try {
        if (
          freights.some(
            (freight) =>
              freight.country.toUpperCase() === data.country.toUpperCase()
          )
        ) {
          toast.error("This country already exists.")
          return
        }
        await addFreight({ ...data, userId })
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
      <form
        className={clsx(className)}
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      >
        <Select
          className="flex-1"
          name="country"
          error={formState.errors.country}
        >
          {getData().map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </Select>
        <Input
          className="flex-1"
          name="price"
          type="number"
          placeholder="Price"
          error={formState.errors.price}
        />
        <button
          type="submit"
          className={clsx(
            "h-[50px] w-full px-5 py-2.5 sm:w-auto",
            "flex items-center text-center",
            "bg-blue-700 text-white hover:bg-blue-800",
            "dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
            "focus:outline-none focus:ring-4 focus:ring-blue-300",
            "rounded-lg text-sm font-medium"
          )}
        >
          {(formState.isSubmitting || isPending) && <LoadingSpinner />}
          Add
        </button>
      </form>
    </FormProvider>
  )
}

export default AddFreight
