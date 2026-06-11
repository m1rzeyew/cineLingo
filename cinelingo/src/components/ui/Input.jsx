import { forwardRef } from 'react'
import { cn, getApiErrorMessage } from '../../utils/helpers'

const Input = forwardRef(function Input(
  { label, error, hint, prefix, suffix, className, containerClass, ...props },
  ref
) {
  const errorText = error ? getApiErrorMessage(error, 'Invalid value.') : ''

  return (
    <div className={cn('flex flex-col gap-1.5', containerClass)}>
      {label && (
        <label className="field-label">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <span className="pointer-events-none absolute left-3.5 text-slate-400 dark:text-slate-500">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm',
            'placeholder:text-slate-400 transition-all duration-200',
            'focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15',
            'disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400',
            'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-400 dark:focus:ring-brand-400/15 dark:disabled:bg-slate-900',
            errorText && 'border-red-400 focus:border-red-500 focus:ring-red-500/10 dark:border-red-500 dark:focus:border-red-400',
            prefix && 'pl-10',
            suffix && 'pr-10',
            className,
          )}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3.5 text-slate-400 dark:text-slate-500">
            {suffix}
          </span>
        )}
      </div>
      {errorText && <p className="text-xs font-semibold text-red-500 dark:text-red-400">{errorText}</p>}
      {hint && !errorText && <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
    </div>
  )
})

export default Input
