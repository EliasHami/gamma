import { TrashIcon, CheckIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import React, { type MouseEventHandler } from 'react'

type ActionsProps = {
  onEdit?: MouseEventHandler<HTMLButtonElement>
  onDelete?: MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
}

const Actions: React.FC<ActionsProps> = ({ onEdit, onDelete, disabled }) => {
  return (
    <div className="flex justify-center items-center gap-1">
      <button onClick={onEdit} disabled={disabled}>
        <PencilSquareIcon className="w-5 h-5 text-blue-500" />
      </button>
      <button onClick={onDelete} disabled={disabled}>
        <TrashIcon className="w-5 h-5 text-red-500" />
      </button>
      <button disabled={disabled}>
        <CheckIcon className="w-5 h-5 text-green-500" />
      </button>
    </div>
  )
}

export default Actions