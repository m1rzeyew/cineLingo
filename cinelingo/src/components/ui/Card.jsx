import { cn } from '../../utils/helpers'

export default function Card({ children, className, hover, onClick, padding = 'p-5' }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl border border-slate-200 bg-white shadow-card transition-all duration-200',
        'dark:border-slate-700 dark:bg-slate-800 dark:shadow-dark/20',
        padding,
        hover && 'hover:-translate-y-1 hover:border-brand-300 hover:shadow-card-hover dark:hover:border-brand-500',
        onClick && 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function StatCard({ label, value, icon, accent = false }) {
  return (
    <Card className={cn('overflow-hidden', accent && 'border-brand-200 bg-brand-50 dark:border-brand-500/40 dark:bg-brand-500/10')}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-normal text-slate-500 dark:text-slate-400">{label}</span>
          <span className={cn('mt-2 block text-3xl font-bold tracking-normal', accent ? 'text-brand-600 dark:text-brand-300' : 'text-slate-900 dark:text-slate-100')}>
            {value}
          </span>
        </div>
        {icon && (
          <span className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            {icon}
          </span>
        )}
      </div>
    </Card>
  )
}
