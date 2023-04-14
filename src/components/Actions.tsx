import { TrashIcon, Cog8ToothIcon, CheckIcon } from '@heroicons/react/24/outline'

const Actions = () => {
  return (
    <div className="flex justify-center items-center gap-1">
      <TrashIcon className="w-5 h-5 text-red-500" />
      <Cog8ToothIcon className="w-5 h-5 text-blue-500" />
      <CheckIcon className="w-5 h-5 text-green-500" />
    </div>
  )
}

export default Actions