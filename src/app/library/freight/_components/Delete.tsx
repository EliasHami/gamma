"use client"
import { TrashIcon } from '@heroicons/react/24/outline'
import React, { useTransition } from 'react'
import LoadingSpinner from '~/components/Spinner'
import { deleteFreight } from '../actions'

type DeleteProps = {
  id: string
}

const Delete: React.FC<DeleteProps> = ({ id }) => {
  const [isPending, startTransition] = useTransition()

  return (
    <button onClick={() => startTransition(() => deleteFreight(id))}>
      {isPending ? <LoadingSpinner /> : <TrashIcon className="w-5 h-5 text-red-500" />}
    </button>
  )
}

export default Delete