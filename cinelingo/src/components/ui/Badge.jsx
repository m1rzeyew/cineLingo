import { cn } from '../../utils/helpers'

const variants = {
  default: 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
  brand: 'border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-brand-300',
  success: 'border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-brand-300',
  warning: 'border-warning-200 bg-warning-50 text-warning-700 dark:border-warning-500/40 dark:bg-warning-500/10 dark:text-warning-300',
  danger: 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300',
  info: 'border-accent-200 bg-accent-50 text-accent-700 dark:border-accent-500/40 dark:bg-accent-500/10 dark:text-accent-300',
  dark: 'border-slate-200 bg-white/90 text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-white',
}

export default function Badge({ children, variant = 'default', className }) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-lg border px-2 py-0.5 text-[11px] font-bold uppercase tracking-normal',
      variants[variant],
      className,
    )}>
      {children}
    </span>
  )
}
