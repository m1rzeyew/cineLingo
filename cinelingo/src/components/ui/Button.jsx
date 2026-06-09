import { cn } from '../../utils/helpers'

const variants = {
  primary:   'bg-dark-900 text-white hover:bg-dark-800 shadow-sm',
  brand:     'bg-brand-500 text-white hover:bg-brand-600 shadow-amber',
  secondary: 'bg-white text-dark-900 border border-cream-300 hover:border-dark-700 hover:bg-cream-50',
  ghost:     'text-dark-700 hover:bg-cream-200 hover:text-dark-900',
  danger:    'bg-red-600 text-white hover:bg-red-700',
  outline:   'border-2 border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-white',
}

const sizes = {
  xs:  'px-3 py-1.5 text-xs rounded-lg',
  sm:  'px-4 py-2 text-sm rounded-xl',
  md:  'px-5 py-2.5 text-sm rounded-xl',
  lg:  'px-7 py-3.5 text-base rounded-2xl',
  xl:  'px-8 py-4 text-lg rounded-2xl',
}

export default function Button({
  children,
  variant = 'primary',
  size    = 'md',
  loading = false,
  disabled,
  fullWidth,
  className,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
        'active:scale-[0.98] select-none',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-60 cursor-not-allowed pointer-events-none',
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
