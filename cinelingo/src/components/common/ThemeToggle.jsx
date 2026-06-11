import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../utils/helpers'

export default function ThemeToggle({ className }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'group relative inline-flex h-10 w-[76px] items-center rounded-full border p-1 shadow-sm transition-all duration-300',
        'border-slate-200 bg-white hover:border-brand-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50',
        'dark:border-slate-700 dark:bg-slate-800 dark:focus-visible:ring-offset-slate-950',
        className,
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
    >
      <span className="absolute left-3 text-warning-500 transition-all duration-300 group-hover:scale-110 dark:text-slate-500">
        <Sun size={16} />
      </span>
      <span className="absolute right-3 text-slate-400 transition-all duration-300 group-hover:scale-110 dark:text-accent-300">
        <Moon size={16} />
      </span>
      <span
        className={cn(
          'relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-white shadow-amber transition-all duration-300 ease-out',
          isDark ? 'translate-x-9 bg-slate-950 shadow-dark' : 'translate-x-0 bg-brand-500',
        )}
      >
        {isDark ? <Moon size={15} /> : <Sun size={15} />}
      </span>
    </button>
  )
}
