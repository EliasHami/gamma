"use client"
import LoadingSpinner from "@/components/Spinner"
import { TrashIcon } from "@heroicons/react/24/outline"
import React, { useTransition } from "react"

type DeleteProps = {
  id: string
  action: (id: string) => Promise<void>
}

const Delete: React.FC<DeleteProps> = ({ id, action }) => {
  const [isPending, startTransition] = useTransition()

  return (
    <button onClick={() => startTransition(() => action(id))}>
      {isPending ? (
        <LoadingSpinner />
      ) : (
        <TrashIcon className="h-5 w-5 text-red-500" />
      )}
    </button>
  )
}

export default Delete
