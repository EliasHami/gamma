import { useFormContext } from "react-hook-form"

type InputProps = {
  name : string
  label: string
  type: string
  required?: boolean
  placeholder?: string
  error?: {
    message: string
  }
}

const Input: React.FC<InputProps> = ({ name, label, type, placeholder, error, required }) => {
  const { register } = useFormContext()

  if (!name) return null

  return (
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="input">
        {label}
      </label>
      <input className={`${error ? "border-red-500" : ""} shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
        id="input"
        type={type}
        placeholder={placeholder}
        required={required}
        {...register(name)}
      />
      {error && <p className="text-red-500 text-xs italic">{error?.message}</p>}
    </div>
  )
}
export default Input