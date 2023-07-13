import clsx from "clsx"
import { type FieldError, useFormContext } from "react-hook-form"

type InputProps = {
  name: string
  label?: string
  type: string
  placeholder?: string
  error?: FieldError,
  className?: string,
  step?: string
}

const Input: React.FC<InputProps> = ({ name, label, type, placeholder, error, className, step }) => {
  const { register } = useFormContext()
  let options = {}
  if (!name) return null
  if (type === "number") options = { valueAsNumber: true }

  return (
    <div className={clsx(className, "mb-6")}>
      {label && <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="input">
        {label}
      </label>}
      <input className={`${error ? "border-red-500" : ""} min-h-[50px] shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
        id="input"
        type={type}
        placeholder={placeholder}
        step={type === "number" ? step : undefined}
        {...register(name, options)}
      />
      {error && <p className="text-red-500 text-xs italic">{error?.message}</p>}
    </div>
  )
}
export default Input