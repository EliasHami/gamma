"use client"
import { TrashIcon } from '@heroicons/react/24/outline'
import React, { useTransition } from 'react'
import LoadingSpinner from '~/components/Spinner'

type DeleteProps = {
  id: string
  action: (id: string) => Promise<void>
}

const Delete: React.FC<DeleteProps> = ({ id, action }) => {
  const [isPending, startTransition] = useTransition()

  return (
    <button onClick={() => startTransition(() => action(id))}>
      {isPending ? <LoadingSpinner /> : <TrashIcon className="w-5 h-5 text-red-500" />}
    </button>
  )
}

export default Delete