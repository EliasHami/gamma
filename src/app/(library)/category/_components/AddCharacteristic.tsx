"use client"

import { useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  CHARACTERISTIC_FIELD_TYPE,
  type ProductCharacteristic,
} from "@prisma/client"
import {
  FormProvider,
  useForm,
  type SubmitHandler,
  type UseFormProps,
} from "react-hook-form"

import { catchError, UNITS } from "@/lib/utils"
import Input from "@/components/forms/Input"
import Select from "@/components/forms/Select"
import LoadingSpinner from "@/components/Spinner"
import { characteristicFormSchema } from "@/app/(library)/category/_components/schemas"
import { addCharacteristic } from "@/app/(library)/category/actions"

type Props = {
  subFamilyId: string
  userId: string
}

const AddCharacteristic: React.FC<Props> = ({ subFamilyId, userId }) => {
  const [isPending, startTransition] = useTransition()
  const formOptions: UseFormProps<ProductCharacteristic> = {
    resolver: zodResolver(characteristicFormSchema),
  }

  const methods = useForm<ProductCharacteristic>(formOptions)
  const { handleSubmit, formState, setValue, watch } = methods
  const [type, name] = watch(["type", "name"])
  const onSubmit: SubmitHandler<ProductCharacteristic> = (data) => {
    if (!data.name) return

    startTransition(async () => {
      try {
        console.log("here")
        await addCharacteristic(data, userId, subFamilyId)
        setValue("name", "")
        setValue("type", CHARACTERISTIC_FIELD_TYPE.TEXT)
        setValue("unit", null)
      } catch (e) {
        catchError(e)
      }
    })
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
          placeholder="Name"
          error={formState.errors.name}
        />
        <Select name="type" label="type" error={formState.errors.type}>
          {Object.entries(CHARACTERISTIC_FIELD_TYPE).map(([key, fieldType]) => (
            <option key={key} value={key} className="capitalize">
              {fieldType}
            </option>
          ))}
        </Select>
        {type === CHARACTERISTIC_FIELD_TYPE.NUMBER && (
          <Select name="unit" label="unit" error={formState.errors.unit}>
            {Object.entries(UNITS).map(([key, { name }]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </Select>
        )}
        <button
          type="submit"
          disabled={formState.isSubmitting || isPending || !name}
          className="flex h-[50px] w-full items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
        >
          {(formState.isSubmitting || isPending) && <LoadingSpinner />}
          Add
        </button>
      </form>
    </FormProvider>
  )
}

export default AddCharacteristic
