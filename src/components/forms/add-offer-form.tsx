"use client"

import React, { useTransition } from "react"
import { useRouter } from "next/navigation"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { OFFER_STATUSES, YESNO, type Offer } from "@prisma/client"
import CurrencyList from "currency-list"
import {
  FormProvider,
  useForm,
  type SubmitHandler,
  type UseFormProps,
} from "react-hook-form"
import { toast } from "react-hot-toast"

import type { ProductSelect, SupplierSelect } from "@/lib/offer"
import { DatePicker } from "@/components/date-picker"
import ImagePicker from "@/components/forms/ImagePicker"
import Input from "@/components/forms/Input"
import Select from "@/components/forms/Select"
import LoadingSpinner from "@/components/Spinner"
import { getErrorMessage } from "@/app/utils"

import { createOffer, updateOffer } from "../../app/offer/actions"
import offerFormSchema from "../../lib/validations/offer"

type OfferFormProps = {
  offer?: Offer
  products: ProductSelect[]
  suppliers: SupplierSelect[]
  userId: string
}

const OfferForm: React.FC<OfferFormProps> = ({
  offer,
  products,
  suppliers,
  userId,
}) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const formOptions: UseFormProps<Offer> = {
    resolver: zodResolver(offerFormSchema),
  }
  if (offer) {
    formOptions.defaultValues = offer
  }

  const methods = useForm<Offer>(formOptions)
  const { handleSubmit, formState } = methods
  const { errors } = formState

  const onSubmit: SubmitHandler<Offer> = (data) => {
    startTransition(async () => {
      try {
        offer
          ? await updateOffer({ ...data, id: offer.id, userId })
          : await createOffer({ ...data, userId })
      } catch (error) {
        toast.error("Error while submitting offer. Please try again later.")
        console.error(getErrorMessage(error))
        return
      }
      toast.success("Offer submited successfully")
    })
    router.push("/offer")
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
            <Select name="needId" label="Product Need" error={errors.needId}>
              {products?.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </Select>
            <Select
              name="supplierId"
              label="Supplier"
              error={errors.supplierId}
            >
              {suppliers?.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </Select>
            <DatePicker
              name="date"
              label="Date"
              error={errors.date}
              description="Date of the offer"
            />
            <Input
              name="fobPrice"
              label="FOB Price"
              type="number"
              placeholder="999.999"
              error={errors.fobPrice}
            />
            <Select name="currency" label="Currency" error={errors.currency}>
              {Object.values(CurrencyList.getAll("en_US")).map(
                (currency: { code: string; name: string }) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name}
                  </option>
                )
              )}
            </Select>
            <Select
              name="validation"
              label="Validation"
              error={errors.validation}
            >
              {Object.entries(YESNO).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </Select>
            <Select name="status" label="Status" error={errors.status}>
              {Object.entries(OFFER_STATUSES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </Select>
            <Input
              name="quantityPerContainer"
              label="Quantity Per Container"
              type="number"
              placeholder="999.999"
              error={errors.quantityPerContainer}
            />
            <ImagePicker name="image" label="Image" error={errors.image} />
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

export default OfferForm
