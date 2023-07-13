import clsx from "clsx"
import { useFormContext, type FieldError } from "react-hook-form"

type InputProps = {
  name: string
  label?: string
  type: string
  placeholder?: string
  error?: FieldError
  className?: string
  step?: string
}

const Input: React.FC<InputProps> = ({
  name,
  label,
  type,
  placeholder,
  error,
  className,
  step,
}) => {
  const { register } = useFormContext()
  let options = {}
  if (!name) return null
  if (type === "number") options = { valueAsNumber: true }

  return (
    <div className={clsx(className, "mb-6")}>
      {label && (
        <label
          className="mb-2 block text-sm font-bold text-gray-700"
          htmlFor="input"
        >
          {label}
        </label>
      )}
      <input
        className={`${
          error ? "border-red-500" : ""
        } focus:shadow-outline mb-3 min-h-[50px] w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none`}
        id="input"
        type={type}
        placeholder={placeholder}
        step={type === "number" ? step : undefined}
        {...register(name, options)}
      />
      {error && <p className="text-xs italic text-red-500">{error?.message}</p>}
    </div>
  )
}
export default Input
