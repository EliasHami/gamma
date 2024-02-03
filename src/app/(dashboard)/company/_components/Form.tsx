"use client"

import React, { useTransition } from "react"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { type Company } from "@prisma/client"
import { getData } from "country-list"
import CurrencyList from "currency-list"
import {
  FormProvider,
  useForm,
  type SubmitHandler,
  type UseFormProps,
} from "react-hook-form"
import { toast } from "react-hot-toast"

import { catchError } from "@/lib/utils"
import Input from "@/components/forms/Input"
import Select from "@/components/forms/Select"
import LoadingSpinner from "@/components/Spinner"
import { updateOrCreateCompany } from "@/app/(dashboard)/company/actions"
import companyFormSchema from "@/app/(dashboard)/company/shemas"

type CompanyFormProps = {
  company: Company | null
  userId: string
}

const CompanyForm: React.FC<CompanyFormProps> = ({ company, userId }) => {
  const [isPending, startTransition] = useTransition()
  const defaultValues = company
    ? company
    : {
        name: "",
      }
  const formOptions: UseFormProps<Company> = {
    resolver: zodResolver(companyFormSchema),
    defaultValues,
  }
  const methods = useForm<Company>(formOptions)
  const { handleSubmit, formState } = methods
  const { errors } = formState

  const onSubmit: SubmitHandler<Company> = (data) => {
    startTransition(async () => {
      try {
        await updateOrCreateCompany({ ...data, id: company?.id, userId })
        toast.success("Company submited successfully")
      } catch (error) {
        catchError(error)
      }
    })
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
            <Input name="name" label="Name" type="text" error={errors.name} />
            <Input
              name="address"
              label="address"
              type="text"
              error={errors.address}
            />
            <Input
              name="email"
              label="email"
              type="text"
              error={errors.email}
            />
            <Input
              name="phone"
              label="phone"
              type="text"
              error={errors.phone}
            />
            <Select name="country" label="country" error={errors.country}>
              {getData().map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </Select>
            <Select name="currency" label="Currency" error={errors.currency}>
              {Object.values(CurrencyList.getAll("en_US")).map(
                (currency: { code: string; name: string }) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name}
                  </option>
                )
              )}
            </Select>
            <Input
              name="insuranceRate"
              label="Insurance rate"
              type="number"
              error={errors.insuranceRate}
              step="0.01"
            />
            <Input
              name="bankChargeRate"
              label="Bank charge rate"
              type="number"
              error={errors.bankChargeRate}
              step="0.01"
            />
            <Input
              name="customsRate"
              label="Customs rate"
              type="number"
              error={errors.customsRate}
              step="0.01"
            />
            <Input
              name="VATRate"
              label="VAT Rate"
              type="number"
              error={errors.VATRate}
              step="0.01"
            />
            <Input
              name="margin"
              label="Margin Rate"
              type="number"
              error={errors.margin}
              step="0.01"
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

export default CompanyForm
