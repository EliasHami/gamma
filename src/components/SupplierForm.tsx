import { COUNTRY, type Supplier, YESNO, SUPPLIER_STATUSES } from "@prisma/client"
import React from "react"
import { type UseFormProps, useForm, type SubmitHandler, FormProvider } from "react-hook-form"
import Input from "~/components/Input"
import Select from "~/components/Select"
import LoadingSpinner from "~/components/Spinner"
import PageLayout from "~/components/pageLayout"
import { api } from "~/utils/api"
import { DevTool } from "@hookform/devtools"
import { useRouter } from "next/router"
import { toast } from 'react-hot-toast'
import { zodResolver } from "@hookform/resolvers/zod"
import supplierFormSchema from "~/schemas/supplier"

const SupplierForm: React.FC<{ id?: string }> = ({ id }) => {
  const router = useRouter()
  let title = "New Supplier";
  const formOptions: UseFormProps<Supplier> = { resolver: zodResolver(supplierFormSchema), }
  if (typeof id == 'string') {
    const data = api.suppliers.getById.useQuery({
      id
    }).data;
    formOptions.defaultValues = data
    title = `Edit ${data?.name ? data.name : "Supplier"}`;
  }

  const methods = useForm<Supplier>(formOptions)
  const { handleSubmit, formState } = methods
  const { errors } = formState

  const ctx = api.useContext();
  const { mutate, isLoading } = api.suppliers.createOrUpdate.useMutation({
    onSuccess: async () => {
      await router.push("/supplier")
      void ctx.suppliers.getAll.invalidate();
    },
    onError: () => {
      toast.error("Failed to submit! Please check the form and try again.")
    }
  })

  const onSubmit: SubmitHandler<Supplier> = (data) => {
    return typeof id == 'string'
      ? mutate({ ...data, id })
      : mutate({ ...data })
  }

  return (
    <PageLayout noNew title={title}>
      <FormProvider {...methods}>
        <form id="hook-form" className="flex justify-center" onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
          <div className="w-1/2">
            <Input name="name" label="Name" type="text" placeholder="Your supplier" error={errors.name} />
            <Input name="email" label="Email" type="email" placeholder="Your supplier email" error={errors.email} />
            <Input name="phone" label="Phone" type="tel" placeholder="Your supplier phone" error={errors.phone} />
            <Select name="country" label="Country" error={errors.country}>
              {Object.entries(COUNTRY).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </Select>
            <Select name="validation" label="Validation" error={errors.validation}>
              {Object.entries(YESNO).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </Select>
            <Select name="status" label="Status" error={errors.status}>
              {Object.entries(SUPPLIER_STATUSES).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </Select>
            <button type="submit" className="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              {(formState.isSubmitting || isLoading) && <LoadingSpinner />}
              Submit
            </button>
          </div>
        </form>
      </FormProvider>
      <DevTool control={methods.control} /> {/* set up the dev tool */}
    </PageLayout >
  )
}

export default SupplierForm