import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Play, Search } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import Input from '../../components/ui/Input'
import PageHeader, { EmptyState } from '../../components/ui/PageHeader'
import { cn, getApiErrorMessage, levelLabel, resolveBackendMediaUrl } from '../../utils/helpers'
import { unitService } from '../../services'
import { useLanguage } from '../../context/LanguageContext'

const normalizeUnit = (unit) => ({
  ...unit,
  imageUrl: resolveBackendMediaUrl(unit.imageUrl ?? unit.ImageUrl),
  levelName: unit.levelName || unit.level || levelLabel(unit.englishLevel),
  isCompleted: unit.isCompleted || unit.status === 'Completed',
})

export default function UnitsPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await unitService.getAll()
        if (active) setUnits((Array.isArray(res.data) ? res.data : []).map(normalizeUnit))
      } catch (err) {
        if (active) setError(getApiErrorMessage(err, t('units.loadError', 'Could not load units.')))
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => { active = false }
  }, [])

  const filtered = useMemo(() => units.filter(u =>
    search === '' || u.title?.toLowerCase().includes(search.toLowerCase())
  ), [search, units])

  const handleUnitClick = (unit) => {
    navigate(`/units/${unit.id}`)
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:py-8">
      <PageHeader
        eyebrow={t('catalog', 'Catalog')}
        title={t('learningUnits', 'Learning units')}
        description={t('units.description', 'Browse film-based lessons, vocabulary sets, and quizzes aligned to your current level.')}
        action={
          <div className="w-full md:w-72">
            <Input placeholder={t('searchUnits', 'Search units...')} prefix={<Search size={14} />} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        }
      />

      {loading && <p className="text-sm text-dark-500">{t('loadingUnits', 'Loading units...')}</p>}
      {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{getApiErrorMessage(error)}</p>}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {!loading && filtered.map((unit) => {
          return (
            <button
              key={unit.id}
              onClick={() => handleUnitClick(unit)}
              className={cn(
                'group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-card transition-all duration-300 dark:border-slate-700 dark:bg-slate-800',
                'hover:-translate-y-1 hover:border-brand-300 hover:shadow-card-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:hover:border-brand-500',
              )}
            >
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-brand-500 to-accent-600">
                {unit.imageUrl
                  ? <img src={unit.imageUrl} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  : <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-500 to-accent-600 text-white/80"><BookOpen size={34} /></div>}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
                <div className="absolute left-4 top-4 flex gap-2">
                  <Badge variant="dark">{unit.levelName}</Badge>
                </div>
                <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-600 shadow-card">
                  <Play size={17} />
                </div>
              </div>
              <div className="p-5">
                <h2 className="line-clamp-2 text-base font-bold text-slate-950 dark:text-white">{unit.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{unit.description || t('noDescriptionYet', 'No description has been added yet.')}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-normal text-slate-400 dark:text-slate-500">{unit.wordCount ?? 0} {t('words', 'words')}</span>
                  {unit.isCompleted && <Badge variant="success">{t('done', 'Done')}</Badge>}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {!loading && filtered.length === 0 && (
        <EmptyState icon={Search} title={t('noUnitsFound', 'No units found')} description={t('units.trySearchHint', 'Try another search term or clear the search input.')} />
      )}
    </div>
  )
}
