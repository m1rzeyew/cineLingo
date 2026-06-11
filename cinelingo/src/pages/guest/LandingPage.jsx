import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, BookOpen, Check, Film, Globe2, GraduationCap,
  MessageSquare, Play, Sparkles, Trophy, Zap,
} from 'lucide-react'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { useLanguage } from '../../context/LanguageContext'

const FEATURES = [
  { icon: Film, title: 'home.featureSceneTitle', desc: 'home.featureSceneDesc' },
  { icon: BookOpen, title: 'home.featureVocabularyTitle', desc: 'home.featureVocabularyDesc' },
  { icon: Zap, title: 'home.featureQuizTitle', desc: 'home.featureQuizDesc' },
  { icon: MessageSquare, title: 'home.featureChatTitle', desc: 'home.featureChatDesc' },
  { icon: Trophy, title: 'home.featureProgressTitle', desc: 'home.featureProgressDesc' },
  { icon: Globe2, title: 'home.featureLevelsTitle', desc: 'home.featureLevelsDesc' },
]

const STEPS = [
  ['01', 'home.stepOneTitle', 'home.stepOneDesc'],
  ['02', 'home.stepTwoTitle', 'home.stepTwoDesc'],
  ['03', 'home.stepThreeTitle', 'home.stepThreeDesc'],
  ['04', 'home.stepFourTitle', 'home.stepFourDesc'],
]

const LEVELS = [
  ['home.beginner', 'A1', 'home.levelBeginnerDesc'],
  ['home.intermediate', 'B1', 'home.levelIntermediateDesc'],
  ['home.advanced', 'C1', 'home.levelAdvancedDesc'],
]

const METRICS = [
  ['12K+', 'home.learners'],
  ['200+', 'home.units'],
  ['94%', 'home.completion'],
  ['4.8/5', 'home.rating'],
]

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-card-hover dark:border-slate-700 dark:bg-slate-800 dark:hover:border-brand-500">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:bg-brand-500/10 dark:text-brand-300">
        <Icon size={20} />
      </div>
      <h3 className="mb-2 text-base font-bold text-slate-950 dark:text-white">{title}</h3>
      <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">{desc}</p>
    </article>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <div className="bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <section className="cinema-surface relative min-h-[92vh] overflow-hidden px-4 pt-24 sm:px-6">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(26,22,18,0)_72%,#FAF7F2_100%)] dark:bg-[linear-gradient(to_bottom,rgba(26,22,18,0)_72%,#120E0B_100%)]" />
        <div className="relative mx-auto flex min-h-[calc(92vh-6rem)] max-w-screen-xl flex-col justify-center pb-16">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 backdrop-blur-xl">
              <Sparkles size={14} className="text-brand-300" />
              <span className="text-xs font-bold uppercase tracking-normal text-white/85">{t('home.badge')}</span>
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-normal text-white sm:text-6xl lg:text-7xl">
              {t('home.title')}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl">
              {t('home.subtitle')}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="xl" variant="brand" onClick={() => navigate('/register')}>
                {t('home.startLearning')} <ArrowRight size={18} />
              </Button>
              <Button size="xl" variant="secondary" onClick={() => navigate('/login')} className="border-white/25 bg-white/15 text-white hover:bg-white/25 hover:text-white dark:border-white/25 dark:bg-white/10">
                <Play size={17} className="fill-current" /> {t('home.signIn')}
              </Button>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {METRICS.map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur-xl">
                  <p className="text-2xl font-black tracking-normal text-white">{value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-normal text-white/60">{t(label)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-screen-xl">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <Badge variant="brand">{t('home.productBadge')}</Badge>
              <h2 className="mt-4 max-w-2xl text-3xl font-black tracking-normal text-slate-950 sm:text-4xl dark:text-white">
                {t('home.featuresTitle')}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              {t('home.featuresText')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(feature => <FeatureCard key={feature.title} icon={feature.icon} title={t(feature.title)} desc={t(feature.desc)} />)}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white px-4 py-20 dark:border-slate-800 dark:bg-slate-900/60 sm:px-6">
        <div className="mx-auto grid max-w-screen-xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Badge variant="info">{t('home.flowBadge')}</Badge>
            <h2 className="mt-4 text-3xl font-black tracking-normal text-slate-950 sm:text-4xl dark:text-white">
              {t('home.flowTitle')}
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {t('home.flowText')}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {STEPS.map(([n, title, desc]) => (
              <article key={n} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800">
                <p className="font-mono text-xs font-bold text-brand-600 dark:text-brand-300">{n}</p>
                <h3 className="mt-5 text-base font-bold text-slate-950 dark:text-white">{t(title)}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{t(desc)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="levels" className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-screen-xl">
          <div className="mb-10 text-center">
            <Badge variant="warning">{t('home.curriculumBadge')}</Badge>
            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-black tracking-normal text-slate-950 sm:text-4xl dark:text-white">
              {t('home.curriculumTitle')}
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {LEVELS.map(([name, code, desc], index) => (
              <article key={name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-4xl font-black tracking-normal text-brand-600 dark:text-brand-300">{code}</p>
                    <h3 className="mt-4 text-lg font-bold text-slate-950 dark:text-white">{t(name)}</h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t(desc)}</p>
                  </div>
                  {index === 0 && <Badge variant="brand">{t('home.free')}</Badge>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-screen-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card dark:border-slate-700 dark:bg-slate-800">
          <div className="grid lg:grid-cols-[1fr_0.9fr]">
            <div className="p-8 sm:p-10 lg:p-12">
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-white shadow-amber">
                <GraduationCap size={21} />
              </div>
              <h2 className="max-w-xl text-3xl font-black tracking-normal text-slate-950 sm:text-4xl dark:text-white">
                {t('home.aboutTitle')}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                {t('home.aboutText')}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button variant="brand" size="lg" onClick={() => navigate('/register')}>
                  {t('home.createAccount')} <ArrowRight size={17} />
                </Button>
                <Button variant="secondary" size="lg" onClick={() => navigate('/login')}>
                  {t('home.signIn')}
                </Button>
              </div>
            </div>
            <div className="border-t border-slate-200 bg-slate-50 p-8 dark:border-slate-700 dark:bg-slate-900 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <div className="space-y-4">
                {['home.apiProgress', 'home.studyRooms', 'home.realEndpoints'].map(item => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                    <Check size={16} className="text-brand-500" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t(item)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-4 py-8 dark:border-slate-800 sm:px-6">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white">
              <GraduationCap size={15} />
            </div>
            <span className="text-sm font-black tracking-normal text-slate-950 dark:text-white">Cine<span className="text-brand-500">Lingo</span></span>
          </div>
          <p className="text-xs text-slate-400">&copy; {new Date().getFullYear()} {t('home.footer')}</p>
        </div>
      </footer>
    </div>
  )
}
