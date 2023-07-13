import React from "react"
import { useFormContext, type FieldError } from "react-hook-form"

type ImagePickerProps = {
  name: string
  label: string
  error?: FieldError
}

const ImagePicker: React.FC<ImagePickerProps> = ({ name, label, error }) => {
  const { register } = useFormContext()
  if (!name) return null
  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0]
  //   console.log(file)
  // }

  return (
    <div className="mb-6">
      <label
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        htmlFor="file_input"
      >
        {label}
      </label>
      <input
        className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400"
        aria-describedby="file_input_help"
        id="file_input"
        type="file"
        accept=".svg, .png, .jpg, .gif"
        {...register(name)}
        // upload to blob storage and save url
      />
      <p
        className="mt-1 text-sm text-gray-500 dark:text-gray-300"
        id="file_input_help"
      >
        SVG, PNG, JPG or GIF (MAX. 800x400px).
      </p>
      {error && <p className="text-xs italic text-red-500">{error?.message}</p>}
    </div>
  )
}

export default ImagePicker
