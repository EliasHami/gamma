"use client"

import React, { useTransition } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { type FileWithPreview } from "@/types"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { OFFER_STATUSES, YESNO, type Offer } from "@prisma/client"
import { generateReactHelpers } from "@uploadthing/react"
import CurrencyList from "currency-list"
import { useForm, type SubmitHandler, type UseFormProps } from "react-hook-form"
import { toast } from "react-hot-toast"
import { type z } from "zod"

import type { ProductSelect, SupplierSelect } from "@/lib/offer"
import { catchError, isArrayOfFile } from "@/lib/utils"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  UncontrolledFormMessage,
} from "@/components/ui/form"
import { DatePicker } from "@/components/date-picker"
import { FileDialog } from "@/components/file-dialog"
import Input from "@/components/forms/Input"
import Select from "@/components/forms/Select"
import LoadingSpinner from "@/components/Spinner"
import { type OurFileRouter } from "@/app/api/uploadthing/core"

import { createOffer, updateOffer } from "../../app/offer/actions"
import offerFormSchema, { type imagesSchema } from "../../lib/validations/offer"

type OfferFormProps = {
  offer?: Offer
  products: ProductSelect[]
  suppliers: SupplierSelect[]
  userId: string
}

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

type Images = z.infer<typeof imagesSchema>

const OfferForm: React.FC<OfferFormProps> = ({
  offer,
  products,
  suppliers,
  userId,
}) => {
  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const formOptions: UseFormProps<Offer> = {
    resolver: zodResolver(offerFormSchema),
  }
  if (offer) {
    formOptions.defaultValues = offer
  } else {
    formOptions.defaultValues = {
      needId: "",
      supplierId: "",
      date: new Date(),
      currency: "USD",
      images: [],
    }
  }

  React.useEffect(() => {
    const images = offer?.images as Images
    if (images?.length > 0) {
      setFiles(
        images.map((image) => {
          const file = new File([], image.name, {
            type: "image",
          })
          const fileWithPreview = Object.assign(file, {
            preview: image.url,
          })

          return fileWithPreview
        })
      )
    }
  }, [offer])

  const methods = useForm<Offer>(formOptions)
  const { handleSubmit, formState } = methods
  const { errors } = formState

  const { isUploading, startUpload } = useUploadThing("offerImage", {
    onClientUploadComplete: () => {
      toast.success("uploaded images successfully!")
    },
    onUploadError: (e) => {
      console.error(e)
      throw e
    },
  })

  const onSubmit: SubmitHandler<Offer> = (data) => {
    startTransition(async () => {
      try {
        let images: Images = []
        if (isArrayOfFile(data.images)) {
          const imagesToUpload: FileWithPreview[] = []
          data.images.forEach((i) => {
            const ci = i as FileWithPreview
            if (ci.path) {
              imagesToUpload.push(ci)
            } else {
              // already uploaded
              images.push({
                name: ci.name,
                size: ci.size,
                url: ci.preview,
              })
            }
          })
          const res = await startUpload(imagesToUpload)
          images = res ? [...images, ...res] : images
        }
        console.log({ data, images })
        offer
          ? await updateOffer({
              ...data,
              id: offer.id,
              userId,
              images,
            })
          : await createOffer({ ...data, userId, images })
        toast.success("Offer submited successfully")
        router.push("/offer")
      } catch (error) {
        catchError(error)
      }
    })
  }

  return (
    <>
      <Form {...methods}>
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
            <FormField
              control={methods.control}
              name="images"
              render={({ field }) => (
                <FormItem className="mb-5 flex w-full flex-col gap-1.5">
                  <FormLabel>Images</FormLabel>
                  {files?.length ? (
                    <div className="flex items-center gap-2">
                      {files.map((file, i) => (
                        <Image
                          key={i}
                          src={file.preview}
                          alt={file.name}
                          className="size-20 shrink-0 rounded-md object-cover object-center"
                          width={80}
                          height={80}
                        />
                      ))}
                    </div>
                  ) : null}

                  <FormControl>
                    <FileDialog
                      setValue={methods.setValue}
                      name="images"
                      maxFiles={3}
                      maxSize={1024 * 1024 * 4}
                      files={files}
                      setFiles={setFiles}
                      isUploading={isUploading}
                      disabled={isPending}
                    />
                  </FormControl>
                  <UncontrolledFormMessage
                    message={formState.errors.images?.message}
                  />
                </FormItem>
              )}
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
      </Form>
      <DevTool control={methods.control} /> {/* set up the dev tool */}
    </>
  )
}

export default OfferForm
