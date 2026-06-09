import { cn } from '../../utils/helpers'

const variants = {
  default:  'bg-cream-200 text-dark-700',
  brand:    'bg-brand-100 text-brand-700',
  success:  'bg-green-100 text-green-700',
  warning:  'bg-amber-100 text-amber-700',
  danger:   'bg-red-100 text-red-700',
  info:     'bg-blue-100 text-blue-700',
  dark:     'bg-dark-800 text-white',
}

export default function Badge({ children, variant = 'default', className }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      variants[variant],
      className,
    )}>
      {children}
    </span>
  )
}
