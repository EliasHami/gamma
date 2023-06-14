import clsx from "clsx"
import { type PropsWithChildren } from "react"
import { type FieldError, useFormContext } from "react-hook-form"

type InputProps = {
  name: string
  label: string
  error?: FieldError
  disabled?: boolean
}

const Select = ({ name, label, error, children, disabled }: PropsWithChildren<InputProps>) => {
  const { register } = useFormContext()

  if (!name) return null

  return (
    <div className="mb-6">
      <label className={clsx("block", "text-gray-700", "text-sm", "font-bold", "mb-2", disabled && "opacity-50")} htmlFor="input">
        {label}
      </label>
      <div className={`${error ? "border-red-500" : ""} inline-block relative w-full`}>
        <select
          className={clsx("block", "appearance-none", "w-full", "disabled:opacity-50",
            "bg-white", "border", "border-gray-400",
            "enabled:hover:border-gray-500",
            "px-4", "py-2", "pr-8",
            "rounded",
            "shadow", "leading-tight",
            "focus:outline-none",
            "focus:shadow-outline")}
          {...register(name)}
          disabled={disabled}>
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
        </div>
      </div>
      {error && <p className="text-red-500 text-xs italic">{error?.message}</p>}
    </div>
  )
}
export default Select