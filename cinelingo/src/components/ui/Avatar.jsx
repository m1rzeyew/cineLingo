import { getInitials, cn } from '../../utils/helpers'

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
}

export default function Avatar({ name, src, size = 'md', className }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover bg-cream-200', sizes[size], className)}
      />
    )
  }
  return (
    <div
      className={cn(
        'rounded-full bg-brand-500 text-white font-semibold flex items-center justify-center select-none',
        sizes[size],
        className,
      )}
    >
      {getInitials(name)}
    </div>
  )
}
