import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs"

import Form from "@/components/forms/add-supplier-form"

const NewSupplier = () => {
  const { userId } = auth()
  if (!userId) redirect("/signin")
  return <Form userId={userId} />
}

export default NewSupplier
