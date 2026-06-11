import { cn } from '../../utils/helpers'

const variants = {
  primary: 'bg-brand-500 text-white shadow-amber hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-400',
  brand: 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-amber hover:from-brand-400 hover:to-brand-500',
  secondary: 'border border-slate-200 bg-white text-slate-800 shadow-sm hover:border-brand-300 hover:bg-brand-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-brand-500 dark:hover:bg-slate-700',
  ghost: 'text-slate-700 hover:bg-brand-50 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50',
  danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700',
  outline: 'border border-brand-500 text-brand-600 hover:bg-brand-500 hover:text-white dark:text-brand-300 dark:hover:text-white',
}

const sizes = {
  xs: 'h-8 px-3 text-xs',
  sm: 'h-9 px-4 text-sm',
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
  xl: 'h-12 px-7 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  fullWidth,
  className,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-normal',
        'transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
        'focus-visible:ring-offset-slate-50 select-none dark:focus-visible:ring-offset-slate-950',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'pointer-events-none cursor-not-allowed opacity-60 hover:translate-y-0',
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
