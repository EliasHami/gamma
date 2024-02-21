import clsx from "clsx"
import { useFormContext, type FieldError } from "react-hook-form"

type InputProps = {
  name?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  value?: string | number
  label?: string
  type: string
  placeholder?: string
  error?: FieldError
  className?: string
  step?: string
}

const Input: React.FC<InputProps> = ({
  name,
  onChange,
  value,
  label,
  type,
  placeholder,
  error,
  className,
  step,
}) => {
  const { register } = useFormContext()
  let controlProps = {}
  let options = {}
  if (type === "number") options = { valueAsNumber: true }

  if (onChange) {
    controlProps = { value, onChange }
  } else {
    if (!name) return null
    controlProps = { ...register(name, options) }
  }

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
        {...controlProps}
      />
      {error && <p className="text-xs italic text-red-500">{error?.message}</p>}
    </div>
  )
}
export default Input
