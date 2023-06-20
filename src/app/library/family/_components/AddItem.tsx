"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { FormProvider, type SubmitHandler, type UseFormProps, useForm } from "react-hook-form"
import { z } from "zod"
import { getErrorMessage } from "~/app/utils"
import Input from "~/components/Input"
import LoadingSpinner from "~/components/Spinner"

type AddItemForm = { name: string }

type AddItemProps = {
  action: (
    name: string,
    options: {
      familyId?: string,
      subFamilyId?: string
    }
  ) => Promise<void>
  options?: {
    familyId?: string
    subFamilyId?: string
  }
}

const AddItem: React.FC<AddItemProps> = ({ action, options }) => {
  const [isPending, startTransition] = useTransition()
  const formOptions: UseFormProps<AddItemForm> = { resolver: zodResolver(z.object({ name: z.string() })), }

  const methods = useForm<AddItemForm>(formOptions)
  const { handleSubmit, formState, setValue, setError } = methods
  const onSubmit: SubmitHandler<AddItemForm> = (data) => {
    const name = data.name

    try {
      startTransition(() => action(name, options ?? {}))
      setValue("name", "")
    } catch (e) {
      setError("name", { type: 'custom', message: getErrorMessage(e) })
    }
  }

  return (
    <FormProvider {...methods}>
      <form id="hook-form" className="flex justify-center gap-5" onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
        <Input name="name" type="text" placeholder="Name of the item" error={formState.errors.name} />
        <button type="submit" className="h-[50px] flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          {(formState.isSubmitting || isPending) && <LoadingSpinner />}
          Add
        </button>
      </form>
    </FormProvider>
  )
}

export default AddItem