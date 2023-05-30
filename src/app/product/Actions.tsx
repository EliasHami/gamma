"use client"
import { TrashIcon, CheckIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import React, { useTransition } from 'react'
import LoadingSpinner from '~/components/Spinner'
import { deleteProduct } from '~/server/actions'

type ActionsProps = {
  id: string
}

const Actions: React.FC<ActionsProps> = ({ id }) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const handleEdit = () => router.push(`product/${id}`)

  return (
    <div className="flex justify-center items-center gap-1">
      <button onClick={handleEdit}>
        <PencilSquareIcon className="w-5 h-5 text-blue-500" />
      </button>
      <button onClick={() => startTransition(() => deleteProduct(id))}>
        {isPending ? <LoadingSpinner /> : <TrashIcon className="w-5 h-5 text-red-500" />}
      </button>
      <button>
        <CheckIcon className="w-5 h-5 text-green-500" />
      </button>
    </div>
  )
}

export default Actions