"use client"
import { getErrorMessage } from "@/app/utils"
import LoadingSpinner from "@/components/Spinner"
import {
  CheckIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"
import React, { useTransition } from "react"
import { toast } from "react-hot-toast"
import { deleteOffer } from "../actions"

type ActionsProps = {
  id: string
}

const Actions: React.FC<ActionsProps> = ({ id }) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const handleEdit = () => router.push(`offer/${id}`)
  const handleDelete = () =>
    startTransition(async () => {
      try {
        await deleteOffer(id)
      } catch (e) {
        toast.error("Error deleting offer. Please try again later.")
        console.error(getErrorMessage(e))
        return
      }
      toast.success("Offer deleted successfully.")
    })

  return (
    <div className="flex items-center justify-center gap-1">
      <button onClick={handleEdit}>
        <PencilSquareIcon className="h-5 w-5 text-blue-500" />
      </button>
      <button onClick={handleDelete}>
        {" "}
        {/* 👈 use formAction for progressive enhancement*/}
        {isPending ? (
          <LoadingSpinner />
        ) : (
          <TrashIcon className="h-5 w-5 text-red-500" />
        )}
      </button>
      <button>
        <CheckIcon className="h-5 w-5 text-green-500" />
      </button>
    </div>
  )
}

export default Actions
