"use client"
import { type Offer, CURRENCIES, YESNO, OFFER_STATUSES } from "@prisma/client"
import React, { useTransition } from "react"
import { type UseFormProps, useForm, type SubmitHandler, FormProvider } from "react-hook-form"
import Input from "@/components/Input"
import Select from "@/components/Select"
import LoadingSpinner from "@/components/Spinner"
import { DevTool } from "@hookform/devtools"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { createOffer, updateOffer } from "../actions"
import { toast } from "react-hot-toast"
import offerFormSchema from "../schemas"
import ImagePicker from "@/components/ImagePicker"
import { getErrorMessage } from "@/app/utils"

type SelectOptions = {
  id: string
  name: string
}[]

type OfferFormProps = {
  offer?: Offer
  products: SelectOptions
  suppliers: SelectOptions
}

const OfferForm: React.FC<OfferFormProps> = ({ offer, products, suppliers }) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const formOptions: UseFormProps<Offer> = { resolver: zodResolver(offerFormSchema), }
  if (offer) {
    formOptions.defaultValues = offer
  }

  const methods = useForm<Offer>(formOptions)
  const { handleSubmit, formState } = methods
  const { errors } = formState

  const onSubmit: SubmitHandler<Offer> = (data) => {
    startTransition(async () => {
      try {
        offer ? await updateOffer({ ...data, id: offer.id }) : await createOffer(data)
      } catch (error) {
        toast.error("Error while submitting offer. Please try again later.")
        console.error(getErrorMessage(error))
        return
      }
      toast.success("Offer submited successfully")
    })
    router.push('/offer')
  }

  return (
    <>
      <FormProvider {...methods}>
        <form id="hook-form" className="flex justify-center" onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
          <div className="w-1/2">
            <Select name="needId" label="Product Need" error={errors.needId}>
              {products?.map(({ id, name }) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </Select>
            <Select name="supplierId" label="Supplier" error={errors.supplierId}>
              {suppliers?.map(({ id, name }) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </Select>
            <Input name="fobPrice" label="FOB Price" type="number" placeholder="999.999" error={errors.fobPrice} />
            <Select name="currency" label="Currency" error={errors.currency}>
              {Object.entries(CURRENCIES).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </Select>
            <Select name="validation" label="Validation" error={errors.validation}>
              {Object.entries(YESNO).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </Select>
            <Select name="status" label="Status" error={errors.status}>
              {Object.entries(OFFER_STATUSES).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </Select>
            <Input name="quantityPerContainer" label="Quantity Per Container" type="number" placeholder="999.999" error={errors.quantityPerContainer} />
            <ImagePicker name="image" label="Image" error={errors.image} />
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

export default OfferForm