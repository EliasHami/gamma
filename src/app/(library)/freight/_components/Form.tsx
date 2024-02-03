"use client"

import React from "react"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { type Freight } from "@prisma/client"
import clsx from "clsx"
import {
  FormProvider,
  useFieldArray,
  useForm,
  type UseFormProps,
} from "react-hook-form"
import { z } from "zod"

import Input from "@/components/forms/Input"
import Delete from "@/app/(library)/freight/_components/Delete"
import { freightFormSchema } from "@/app/(library)/freight/schemas"

type FreightFormProps = {
  freights: [Freight]
}

// TODO : form input for each field, workaround for now delete and add new

const EditFreight: React.FC<FreightFormProps> = ({ freights }) => {
  const formOptions: UseFormProps<FreightFormProps> = {
    resolver: zodResolver(z.array(freightFormSchema)),
    defaultValues: { freights },
  }

  const methods = useForm<FreightFormProps>(formOptions)
  const { control } = methods

  const { fields } = useFieldArray({ control, name: "freights" })

  // const onSubmit: SubmitHandler<ProductNeed> = (data) => {
  //   startTransition(async () => {
  //     try {
  //       product ? await updateProduct({ ...data, id: product.id }) : await createProduct({ ...data })
  //     } catch (error) {
  //       toast.error("Error while submitting product. Please try again later.")
  //       console.error(getErrorMessage(error))
  //       return
  //     }
  //     toast.success("Product submited successfully")
  //   })
  //   router.push('/product')
  // }

  const className = "min-w-full justify-center flex flex-row gap-5" // TODO get from props

  return (
    <>
      <FormProvider {...methods}>
        {fields.map((field, index) => (
          <div key={field.id} className={clsx(className, "font-light")}>
            <Input
              type="text"
              name={`freights.${index}.country`}
              className="flex-1"
            />
            <Input
              type="text"
              name={`freights.${index}.price`}
              className="flex-1"
            />
            <div className="flex-0">{<Delete id={field.id} />}</div>
          </div>
        ))}
      </FormProvider>
      <DevTool control={methods.control} /> {/* set up the dev tool */}
    </>
  )
}

export default EditFreight
