"use client"

import React, { useTransition } from "react"
import { TrashIcon } from "@heroicons/react/24/outline"

import LoadingSpinner from "@/components/Spinner"
import { deleteFreight } from "@/app/(library)/freight/actions"

type DeleteProps = {
  id: string
}

const Delete: React.FC<DeleteProps> = ({ id }) => {
  const [isPending, startTransition] = useTransition()

  return (
    <button onClick={() => startTransition(() => deleteFreight(id))}>
      {isPending ? (
        <LoadingSpinner />
      ) : (
        <TrashIcon className="h-5 w-5 text-red-500" />
      )}
    </button>
  )
}

export default Delete
