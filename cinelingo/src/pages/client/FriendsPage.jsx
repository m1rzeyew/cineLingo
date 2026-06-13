import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { UserMinus, Users } from 'lucide-react'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'
import { getApiErrorMessage, levelLabel } from '../../utils/helpers'
import { followService } from '../../services'
import { useLanguage } from '../../context/LanguageContext'

const normalizeUser = (user) => ({
  id: user.id || user.userId,
  userName: user.userName || user.fullName || user.name || 'Learner',
  englishLevel: user.englishLevel ?? user.level,
  avatarUrl: user.avatarUrl,
})

function PersonRow({ user, action }) {
  const { t } = useLanguage()
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-cream-200 bg-white px-4 py-3 shadow-sm">
      <Avatar name={user.userName} src={user.avatarUrl} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-dark-900">{user.userName}</p>
        <p className="text-xs font-semibold text-dark-400">
          {user.englishLevel != null && user.englishLevel !== '' ? levelLabel(user.englishLevel) : t('levelNotSelected', 'Level not selected')}
        </p>
      </div>
      {action}
    </div>
  )
}

export default function FriendsPage() {
  const { t } = useLanguage()
  const [following, setFollowing] = useState([])
  const [followers, setFollowers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const load = async () => {
      const [followingRes, followersRes] = await Promise.allSettled([
        followService.getFollowing(),
        followService.getFollowers(),
      ])

      if (!active) return
      setFollowing((Array.isArray(followingRes.value?.data) ? followingRes.value.data : []).map(normalizeUser))
      setFollowers((Array.isArray(followersRes.value?.data) ? followersRes.value.data : []).map(normalizeUser))
      setLoading(false)
    }

    load()
    return () => { active = false }
  }, [])

  const unfollow = async (id) => {
    try {
      await followService.unfollow(id)
      setFollowing(f => f.filter(x => x.id !== id))
      toast.success(t('unfollowed', 'Unfollowed.'))
    } catch (err) {
      toast.error(getApiErrorMessage(err, t('friends.unfollowError', 'Could not unfollow user.')))
    }
  }

  return (
    <div className="mx-auto max-w-screen-lg px-5 py-8 sm:px-6">
      <PageHeader
        eyebrow={t('social', 'Social')}
        title={t('friends', 'Friends')}
        description={t('friends.description', 'Keep track of learners you follow and people following your CineLingo progress.')}
        action={
          <div className="rounded-2xl border border-cream-200 bg-white px-5 py-3 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-normal text-dark-400">{t('network', 'Network')}</p>
            <p className="text-2xl font-black tracking-normal text-dark-900">{following.length + followers.length}</p>
          </div>
        }
      />

      {loading && (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="skeleton h-72" />
          <div className="skeleton h-72" />
        </div>
      )}

      {!loading && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Card padding="p-5" className="bg-cream-50/70">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black tracking-normal text-dark-900">{t('following', 'Following')}</h2>
                <p className="text-sm text-dark-500">{following.length} {t('learners', 'learners')}</p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-dark-500">
                <Users size={18} />
              </span>
            </div>
            <div className="space-y-3">
              {following.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-cream-300 bg-white px-4 py-8 text-center text-sm text-dark-500">{t('friends.noneFollowing', 'Not following anyone yet.')}</p>
                )}
              {following.map((u) => (
                <PersonRow
                  key={u.id}
                  user={u}
                  action={
                    <Button variant="ghost" size="sm" onClick={() => unfollow(u.id)} aria-label={t('unfollowUser', 'Unfollow {{name}}').replace('{{name}}', u.userName)}>
                      <UserMinus size={15} /> {t('unfollow', 'Unfollow')}
                    </Button>
                  }
                />
              ))}
            </div>
          </Card>

          <Card padding="p-5" className="bg-cream-50/70">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black tracking-normal text-dark-900">{t('followers', 'Followers')}</h2>
                <p className="text-sm text-dark-500">{followers.length} {t('learners', 'learners')}</p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-dark-500">
                <Users size={18} />
              </span>
            </div>
            <div className="space-y-3">
              {followers.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-cream-300 bg-white px-4 py-8 text-center text-sm text-dark-500">{t('friends.noFollowers', 'No followers yet.')}</p>
                )}
              {followers.map((u) => <PersonRow key={u.id} user={u} />)}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
