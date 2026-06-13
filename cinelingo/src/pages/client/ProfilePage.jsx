import { Calendar, Flame, Mail, Shield } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'
import { levelLabel } from '../../utils/helpers'
import { useLanguage } from '../../context/LanguageContext'

export default function ProfilePage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.fullName || 'Learner'

  const rows = [
    [t('firstName', 'First name'), user?.firstName],
    [t('lastName', 'Last name'), user?.lastName],
    [t('email', 'Email'), user?.email],
    [t('englishLevel', 'English level'), levelLabel(user?.englishLevel)],
    [t('memberSince', 'Member since'), user?.createdAt ? new Date(user.createdAt).getFullYear() : '-'],
    [t('subscription', 'Subscription'), user?.isPremium ? t('premium', 'Premium') : t('free', 'Free')],
  ]

  return (
    <div className="mx-auto max-w-screen-lg px-4 py-6 sm:px-6 lg:py-8">
      <PageHeader
        eyebrow={t('account', 'Account')}
        title={t('profile', 'Profile')}
        description={t('profile.description', 'Manage the identity and progress details attached to your learning account.')}
      />

      <Card className="mb-5 overflow-hidden p-0">
        <div className="bg-dark-950 p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <Avatar name={fullName} src={user?.avatarUrl} size="xl" className="ring-4 ring-white/10" />
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-black tracking-normal text-white">{fullName}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="dark">{levelLabel(user?.englishLevel)}</Badge>
                {user?.isPremium && <Badge variant="warning">{t('premium', 'Premium')}</Badge>}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <Card>
          <h2 className="mb-5 text-lg font-black tracking-normal text-dark-900">{t('personalInformation', 'Personal information')}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {rows.map(([label, val]) => (
              <div key={label} className="rounded-2xl border border-cream-200 bg-cream-50 p-4">
                <p className="text-xs font-bold uppercase tracking-normal text-dark-400">{label}</p>
                <p className="mt-2 truncate font-semibold text-dark-900">{val ?? '-'}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-5 text-lg font-black tracking-normal text-dark-900">{t('accountSignals', 'Account signals')}</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-2xl bg-cream-50 p-4">
              <Mail size={18} className="text-brand-600" />
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-normal text-dark-400">{t('email', 'Email')}</p>
                <p className="truncate text-sm font-semibold text-dark-900">{user?.email || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-cream-50 p-4">
              <Flame size={18} className="text-brand-600" />
              <div>
                <p className="text-xs font-bold uppercase tracking-normal text-dark-400">{t('streak', 'Streak')}</p>
                <p className="text-sm font-semibold text-dark-900">{user?.streak ?? 0} {t('days', 'days')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-cream-50 p-4">
              <Shield size={18} className="text-brand-600" />
              <div>
                <p className="text-xs font-bold uppercase tracking-normal text-dark-400">{t('plan', 'Plan')}</p>
                <p className="text-sm font-semibold text-dark-900">{user?.isPremium ? t('premium', 'Premium') : t('free', 'Free')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-cream-50 p-4">
              <Calendar size={18} className="text-brand-600" />
              <div>
                <p className="text-xs font-bold uppercase tracking-normal text-dark-400">{t('joined', 'Joined')}</p>
                <p className="text-sm font-semibold text-dark-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
