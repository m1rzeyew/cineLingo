import { getInitials, cn } from '../../utils/helpers'

const sizes = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-xl',
}

export default function Avatar({ name, src, size = 'md', className }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full border border-white/70 bg-slate-200 object-cover shadow-sm dark:border-slate-700 dark:bg-slate-800', sizes[size], className)}
      />
    )
  }
  return (
    <div
      className={cn(
        'flex select-none items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 font-bold text-white shadow-sm ring-1 ring-white/50 dark:ring-slate-700',
        sizes[size],
        className,
      )}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  )
}
