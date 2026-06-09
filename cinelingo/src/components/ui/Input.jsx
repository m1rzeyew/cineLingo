import { forwardRef } from 'react'
import { cn } from '../../utils/helpers'

const Input = forwardRef(function Input(
  { label, error, hint, prefix, suffix, className, containerClass, ...props },
  ref
) {
  return (
    <div className={cn('flex flex-col gap-1.5', containerClass)}>
      {label && (
        <label className="text-sm font-medium text-dark-800">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3.5 text-dark-600 pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full bg-white border border-cream-300 rounded-xl px-4 py-2.5 text-sm text-dark-900',
            'placeholder:text-dark-600/50',
            'focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500',
            'transition-all duration-200',
            error && 'border-red-400 focus:ring-red-300 focus:border-red-400',
            prefix && 'pl-10',
            suffix && 'pr-10',
            className,
          )}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3.5 text-dark-600">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint  && !error && <p className="text-xs text-dark-600/60">{hint}</p>}
    </div>
  )
})

export default Input
