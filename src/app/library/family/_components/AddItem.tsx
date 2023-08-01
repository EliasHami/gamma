"use client"

import { useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  type ProductCapacity,
  type ProductFamily,
  type ProductSubFamily,
} from "@prisma/client"
import {
  FormProvider,
  useForm,
  type SubmitHandler,
  type UseFormProps,
} from "react-hook-form"
import { z } from "zod"

import Input from "@/components/forms/Input"
import LoadingSpinner from "@/components/Spinner"
import { getErrorMessage } from "@/app/utils"

type AddItemForm = { name: string }

type AddItemProps = {
  action: (
    name: string,
    userId: string,
    searchParams: {
      family?: string
      subFamily?: string
    }
  ) => Promise<ProductFamily | ProductSubFamily | ProductCapacity | undefined>
  searchParams?: {
    family: string
    subFamily: string
  }
  searchKey?: string
  userId: string
}

const AddItem: React.FC<AddItemProps> = ({
  action,
  searchParams,
  searchKey,
  userId,
}) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()
  const formOptions: UseFormProps<AddItemForm> = {
    resolver: zodResolver(z.object({ name: z.string() })),
  }

  const methods = useForm<AddItemForm>(formOptions)
  const { handleSubmit, formState, setValue, setError } = methods
  const onSubmit: SubmitHandler<AddItemForm> = (data) => {
    const name = data.name

    if (!name) return

    try {
      startTransition(async () => {
        const savedItem = await action(name, userId, searchParams ?? {})
        setValue("name", "")
        if (!searchKey || !savedItem) return
        const params = new URLSearchParams(searchParams)
        params.set(searchKey, savedItem.id)
        router.replace(`${pathname}?${params.toString()}`)
      })
    } catch (e) {
      setError("name", { type: "custom", message: getErrorMessage(e) })
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        id="hook-form"
        className="flex justify-center gap-5"
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      >
        <Input
          name="name"
          type="text"
          placeholder="Name of the item"
          error={formState.errors.name}
        />
        <button
          type="submit"
          className="flex h-[50px] w-full items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
        >
          {(formState.isSubmitting || isPending) && <LoadingSpinner />}
          Add
        </button>
      </form>
    </FormProvider>
  )
}

export default AddItem
