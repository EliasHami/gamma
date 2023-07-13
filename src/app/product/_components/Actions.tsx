"use client"
import LoadingSpinner from "@/components/Spinner"
import {
  CheckIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"
import React, { useTransition } from "react"
import { deleteProduct } from "../actions"

type ActionsProps = {
  id: string
}

const Actions: React.FC<ActionsProps> = ({ id }) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const handleEdit = () => router.push(`product/${id}`)

  return (
    <div className="flex items-center justify-center gap-1">
      <button onClick={handleEdit}>
        <PencilSquareIcon className="h-5 w-5 text-blue-500" />
      </button>
      <button onClick={() => startTransition(() => deleteProduct(id))}>
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
