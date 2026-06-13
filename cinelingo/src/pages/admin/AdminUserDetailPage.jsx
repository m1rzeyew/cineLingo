import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Ban, ArrowLeft, Undo2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { adminService } from '../../services'
import { formatDate, showApiErrorOnce } from '../../utils/helpers'
import { useLanguage } from '../../context/LanguageContext'

const normalizeUser = (user) => ({
  ...user,
  levelName: user.level || user.Level || user.levelName || user.LevelName,
})

export default function AdminUserDetailPage() {
  const { t } = useLanguage()
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [banReason, setBanReason] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await adminService.getUserById(id)
      setUser(normalizeUser(res.data))
    } catch (err) {
      showApiErrorOnce(err, t('admin.users.detailLoadError', 'Could not load user detail.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [id])

  const handleBan = async () => {
    try {
      await adminService.banUser(id, { reason: banReason })
      toast.success(t('admin.users.banned', 'User banned.'))
      setBanReason('')
      await load()
    } catch (err) {
      showApiErrorOnce(err, t('admin.users.banError', 'Could not ban user.'))
    }
  }

  const handleUnban = async () => {
    try {
      await adminService.unbanUser(id)
      toast.success(t('admin.users.unbanned', 'User unbanned.'))
      await load()
    } catch (err) {
      showApiErrorOnce(err, t('admin.users.unbanError', 'Could not unban user.'))
    }
  }

  if (loading) return <p className="text-sm text-dark-500">{t('loadingUserDetail', 'Loading user detail...')}</p>
  if (!user) return <p className="text-sm text-dark-500">{t('userNotFound', 'User not found.')}</p>

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-display text-dark-900">{t('userDetail', 'User Detail')}</h1>
          <p className="text-sm text-dark-600">{t('admin.users.detailSubtitle', 'User account and admin actions')}</p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/admin/users')}>
          <ArrowLeft size={16} /> {t('back', 'Back')}
        </Button>
      </div>

      <div className="space-y-5 rounded-2xl border border-cream-200 bg-white p-5">
        <div className="flex items-center gap-4 rounded-2xl border border-cream-200 bg-cream-50 p-4">
          <Avatar name={user.fullName} src={user.avatarUrl} size="md" />
          <div className="min-w-0">
            <h2 className="truncate text-lg font-black tracking-normal text-dark-900">{user.fullName}</h2>
            <p className="truncate text-sm text-dark-500">{user.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant={user.role === 'Admin' ? 'dark' : 'default'}>{t(user.role || 'User', user.role || 'User')}</Badge>
              {user.levelName && <Badge variant="brand">{t(user.levelName, user.levelName)}</Badge>}
              <Badge variant={user.isDeleted ? 'danger' : 'success'}>{user.isDeleted ? t('deleted', 'Deleted') : t('active', 'Active')}</Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-cream-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-normal text-dark-400">{t('username', 'Username')}</p>
            <p className="mt-1 text-sm font-semibold text-dark-800">{user.userName || '-'}</p>
          </div>
          <div className="rounded-xl border border-cream-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-normal text-dark-400">{t('joined', 'Joined')}</p>
            <p className="mt-1 text-sm font-semibold text-dark-800">{user.createdAt ? formatDate(user.createdAt) : '-'}</p>
          </div>
          <div className="rounded-xl border border-cream-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-normal text-dark-400">{t('lastLogin', 'Last Login')}</p>
            <p className="mt-1 text-sm font-semibold text-dark-800">{user.lastLoginAt ? formatDate(user.lastLoginAt) : '-'}</p>
          </div>
          <div className="rounded-xl border border-cream-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-normal text-dark-400">{t('userId', 'User ID')}</p>
            <p className="mt-1 break-all text-xs font-semibold text-dark-800">{user.id}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-cream-200 bg-white p-4">
          <label className="field-label mb-1.5 block">{t('banReason', 'Ban Reason')}</label>
          <textarea value={banReason} onChange={e => setBanReason(e.target.value)} rows={3} className="w-full resize-none rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40" />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="danger" onClick={handleBan}><Ban size={15} /> {t('banUser', 'Ban User')}</Button>
            <Button variant="secondary" onClick={handleUnban}><Undo2 size={15} /> {t('unbanUser', 'Unban User')}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
