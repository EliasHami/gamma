"use client"
import { type Company } from "@prisma/client"
import React, { useTransition } from "react"
import { type UseFormProps, useForm, type SubmitHandler, FormProvider } from "react-hook-form"
import Input from "@/components/Input"
import Select from "@/components/Select"
import LoadingSpinner from "@/components/Spinner"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-hot-toast"
import { getData } from "country-list"
import { updateOrCreateCompany } from "../actions"
import companyFormSchema from "../shemas"
import { getErrorMessage } from "@/app/utils"

type CompanyFormProps = {
  company: Company | null,
  userId: string
}

const CompanyForm: React.FC<CompanyFormProps> = ({ company, userId }) => {
  const [isPending, startTransition] = useTransition()
  const defaultValues = company ? company : {
    name: "",
  }
  const formOptions: UseFormProps<Company> = { resolver: zodResolver(companyFormSchema), defaultValues }
  const methods = useForm<Company>(formOptions)
  const { handleSubmit, formState } = methods
  const { errors } = formState

  const onSubmit: SubmitHandler<Company> = (data) => {
    startTransition(async () => {
      try {
        await updateOrCreateCompany({ ...data, id: company?.id, userId })
      } catch (error) {
        toast.error("Error while submitting company")
        console.error(getErrorMessage(error))
      }
      toast.success("Company submited successfully")
    })
  }

  return (
    <>
      <FormProvider {...methods}>
        <form id="hook-form" className="flex justify-center" onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
          <div className="w-1/2">
            <Input name="name" label="Name" type="text" error={errors.name} />
            <Input name="address" label="address" type="text" error={errors.address} />
            <Input name="email" label="email" type="text" error={errors.email} />
            <Input name="phone" label="phone" type="text" error={errors.phone} />
            <Select name="country" label="country" error={errors.country}>
              {getData().map(country => (
                <option key={country.code} value={country.code}>{country.name}</option>
              ))}
            </Select>
            <Input name="insuranceRate" label="Insurance rate" type="number" error={errors.insuranceRate} step="0.01" />
            <Input name="bankChargeRate" label="Bank charge rate" type="number" error={errors.bankChargeRate} step="0.01" />
            <Input name="customsRate" label="Customs rate" type="number" error={errors.customsRate} step="0.01" />
            <Input name="VATRate" label="VAT Rate" type="number" error={errors.VATRate} step="0.01" />
            <button type="submit" className="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
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

export default CompanyForm