import { cn, getApiErrorMessage } from '../../utils/helpers'

export default function PageHeader({ eyebrow, title, description, action, className }) {
  const descriptionText = description ? getApiErrorMessage(description) : ''

  return (
    <div className={cn('mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between', className)}>
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-normal text-brand-600 dark:text-brand-300">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-black tracking-normal text-slate-950 md:text-4xl dark:text-slate-50">
          {title}
        </h1>
        {descriptionText && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            {descriptionText}
          </p>
        )}
      </div>
      {action}
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description, action }) {
  const descriptionText = description ? getApiErrorMessage(description) : ''

  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 px-6 py-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800/80">
      {Icon && (
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
          <Icon size={20} />
        </div>
      )}
      <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h2>
      {descriptionText && <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">{descriptionText}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
