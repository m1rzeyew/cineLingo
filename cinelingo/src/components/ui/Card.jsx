import { cn } from '../../utils/helpers'

export default function Card({ children, className, hover, onClick, padding = 'p-5' }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl border border-cream-200 shadow-card',
        padding,
        hover && 'hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function StatCard({ label, value, icon, accent = false }) {
  return (
    <Card className={cn('flex flex-col gap-2', accent && 'border-brand-500/20 bg-brand-50/30')}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-dark-600">{label}</span>
        {icon && <span className="text-dark-400">{icon}</span>}
      </div>
      <span className={cn(
        'text-3xl font-bold font-display',
        accent ? 'text-brand-500' : 'text-brand-500',
      )}>
        {value}
      </span>
    </Card>
  )
}
