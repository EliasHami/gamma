"use client"
import { TrashIcon, CheckIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import React from 'react'

type ActionsProps = {
  id: string
}

const Actions: React.FC<ActionsProps> = ({ id }) => {
  const router = useRouter()
  // disabled={isDeleting}
  // onEdit={() => 
  // onDelete={() => 

  // const ctx = api.useContext();
  // const { mutate, isLoading: isDeleting } = api.products.delete.useMutation({
  //   onSuccess: async () => {
  //     await router.push("/product")
  //     void ctx.products.getAll.invalidate();
  //   },
  //   onError: () => {
  //     toast.error("Failed to submit! Please check the form and try again.")
  //   }
  // })

  const handleEdit = () => void router.push(`product/${id}`) // usetransition

  const handleDelete = () => false//void mutate({ id: product.id })}
  return (
    <div className="flex justify-center items-center gap-1">
      <button onClick={handleEdit}>
        <PencilSquareIcon className="w-5 h-5 text-blue-500" />
      </button>
      <button onClick={handleDelete}>
        <TrashIcon className="w-5 h-5 text-red-500" />
      </button>
      <button>
        <CheckIcon className="w-5 h-5 text-green-500" />
      </button>
    </div>
  )
}

export default Actions