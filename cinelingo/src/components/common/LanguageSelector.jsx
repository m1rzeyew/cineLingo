import { Languages } from 'lucide-react'
import { languageOptions } from '../../i18n/translations'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../utils/helpers'

export default function LanguageSelector({ className, tone = 'light' }) {
  const { language, setLanguage, t } = useLanguage()
  const darkOnHero = tone === 'hero'

  return (
    <label className={cn('relative inline-flex h-10 items-center', className)} aria-label={t('language.label')}>
      <Languages size={15} className={cn('pointer-events-none absolute left-3 z-10', darkOnHero ? 'text-white/80' : 'text-brand-600 dark:text-brand-300')} />
      <select
        value={language}
        onChange={e => setLanguage(e.target.value)}
        className={cn(
          'h-10 appearance-none rounded-full border pl-9 pr-8 text-sm font-bold shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
          darkOnHero
            ? 'border-white/25 bg-white/15 text-white backdrop-blur-xl hover:bg-white/20 [&>option]:text-slate-900'
            : 'border-slate-200 bg-white text-slate-800 hover:border-brand-300 hover:bg-brand-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-brand-500',
        )}
      >
        {languageOptions.map(option => (
          <option key={option.code} value={option.code}>{option.label}</option>
        ))}
      </select>
      <span className={cn('pointer-events-none absolute right-3 text-[10px]', darkOnHero ? 'text-white/70' : 'text-slate-400 dark:text-slate-500')}>▼</span>
    </label>
  )
}
