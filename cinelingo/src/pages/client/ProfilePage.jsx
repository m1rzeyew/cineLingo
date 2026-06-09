import { useAuth } from '../../context/AuthContext'
import Avatar from '../../components/ui/Avatar'
import Badge  from '../../components/ui/Badge'
import Card   from '../../components/ui/Card'
import { levelLabel } from '../../utils/helpers'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="max-w-screen-md mx-auto px-6 py-8 animate-fade-in space-y-5">

      {/* Header */}
      <Card className="flex items-center gap-5">
        <Avatar
          name={`${user?.firstName} ${user?.lastName}`}
          src={user?.avatarUrl}
          size="xl"
        />
        <div className="flex-1">
          <h1 className="text-xl font-bold font-display text-dark-900">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-dark-600 text-sm mt-0.5">{user?.email}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="brand">{levelLabel(user?.englishLevel)}</Badge>
            <span className="text-sm">🔥 {user?.streak ?? 7} day streak</span>
            {user?.isPremium && <Badge variant="warning">⭐ Premium</Badge>}
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card>
        <h2 className="font-semibold text-dark-900 mb-5 font-display text-lg">
          Personal Information
        </h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          {[
            ['FIRST NAME',    user?.firstName],
            ['LAST NAME',     user?.lastName],
            ['EMAIL',         user?.email],
            ['ENGLISH LEVEL', levelLabel(user?.englishLevel)],
            ['MEMBER SINCE',  user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'],
            ['SUBSCRIPTION',  user?.isPremium ? 'Premium ⭐' : 'Free'],
          ].map(([label, val]) => (
            <div key={label}>
              <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-1">
                {label}
              </p>
              <p className="font-medium text-dark-900">{val ?? '—'}</p>
            </div>
          ))}
        </div>
      </Card>

    </div>
  )
}