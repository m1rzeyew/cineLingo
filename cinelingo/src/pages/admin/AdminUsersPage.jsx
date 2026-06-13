import { useEffect, useState } from 'react'
import { Ban, Eye, Search, Edit2, Trash2, Undo2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Table from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import toast from 'react-hot-toast'
import { adminService } from '../../services'
import { formatDate, showApiErrorOnce } from '../../utils/helpers'
import { useLanguage } from '../../context/LanguageContext'

const splitName = (fullName = '') => {
  const parts = fullName.split(' ')
  return { firstName: parts[0] || '', lastName: parts.slice(1).join(' ') }
}

const normalizeUser = (user) => ({
  ...user,
  ...splitName(user.fullName),
  levelName: user.level,
})

export default function AdminUsersPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [editUser, setEditUser] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [role, setRole] = useState('User')
  const [banReason, setBanReason] = useState('')
  const [loading, setLoading] = useState(true)

  const loadUsers = async () => {
    setLoading(true)
    try {
      const res = await adminService.getUsers()
      setUsers((Array.isArray(res.data) ? res.data : []).map(normalizeUser))
    } catch (err) {
      showApiErrorOnce(err, t('admin.users.loadError', 'Could not load users.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const filtered = users.filter(u =>
    search === '' || `${u.fullName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  )

  const openRole = (user) => {
    setEditUser(user)
    setRole(user.role || 'User')
  }

  const openDetail = (user) => {
    if (user?.id) navigate(`/admin/users/${user.id}`)
  }

  const handleUpdateRole = async (e) => {
    e.preventDefault()
    try {
      await adminService.updateUserRole(editUser.id, role)
      await loadUsers()
      toast.success(t('admin.users.roleUpdated', 'User role updated.'))
      setEditUser(null)
    } catch (err) {
      showApiErrorOnce(err, t('admin.users.updateRoleError', 'Could not update role.'))
    }
  }

  const handleDelete = async () => {
    try {
      await adminService.deleteUser(deleteTarget.id)
      await loadUsers()
      toast.success(t('admin.users.deleted', 'User deleted.'))
      setDeleteTarget(null)
    } catch (err) {
      showApiErrorOnce(err, t('admin.users.deleteError', 'Could not delete user.'))
    }
  }

  const handleBan = async () => {
    try {
      await adminService.banUser(editUser.id, { reason: banReason })
      toast.success(t('admin.users.banned', 'User banned.'))
      setBanReason('')
      await loadUsers()
    } catch (err) {
      showApiErrorOnce(err, t('admin.users.banError', 'Could not ban user.'))
    }
  }

  const handleUnban = async () => {
    try {
      await adminService.unbanUser(editUser.id)
      toast.success(t('admin.users.unbanned', 'User unbanned.'))
      await loadUsers()
    } catch (err) {
      showApiErrorOnce(err, t('admin.users.unbanError', 'Could not unban user.'))
    }
  }

  const columns = [
    { key: 'name', label: t('user', 'User'), width: '220px',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.fullName} src={row.avatarUrl} size="sm" />
          <div>
            <p className="font-medium text-dark-900 text-sm">{row.fullName}</p>
            <p className="text-xs text-dark-500">{row.email}</p>
          </div>
        </div>
      ) },
    { key: 'role', label: t('role', 'Role'), width: '90px', render: (_, row) => <Badge variant={row.role === 'Admin' ? 'dark' : 'default'}>{t(row.role || 'User', row.role || 'User')}</Badge> },
    { key: 'levelName', label: t('level', 'Level'), width: '160px', render: (v) => v ? <Badge variant="brand">{t(v, v)}</Badge> : '-' },
    { key: 'isDeleted', label: t('state', 'State'), width: '90px', render: (v) => <Badge variant={v ? 'danger' : 'success'}>{v ? t('deleted', 'Deleted') : t('active', 'Active')}</Badge> },
    { key: 'createdAt', label: t('joined', 'Joined'), width: '110px', render: (v) => <span className="text-xs text-dark-500">{v ? formatDate(v) : '-'}</span> },
    { key: 'actions', label: '', width: '80px',
      render: (_, row) => (
        <div className="flex gap-1.5">
          <button onClick={() => openDetail(row)} className="p-1.5 rounded-lg hover:bg-brand-50 text-dark-500 hover:text-brand-700 transition-colors" aria-label={t('view', 'View')}><Eye size={14} /></button>
          <button onClick={() => openRole(row)} className="p-1.5 rounded-lg hover:bg-cream-100 text-dark-500 hover:text-dark-900 transition-colors" aria-label={t('manage', 'Manage')}><Edit2 size={14} /></button>
          <button onClick={() => setDeleteTarget(row)} className="p-1.5 rounded-lg hover:bg-red-50 text-dark-500 hover:text-red-600 transition-colors" aria-label={t('delete', 'Delete')}><Trash2 size={14} /></button>
        </div>
      ) },
  ]

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-dark-900">{t('users', 'Users')}</h1>
          <p className="text-dark-600 text-sm mt-0.5">{users.length} {t('totalUsers', 'total users')}</p>
        </div>
        <div className="w-56">
          <Input placeholder={t('searchUsers', 'Search users...')} prefix={<Search size={14} />} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? <p className="text-sm text-dark-500">{t('loadingUsers', 'Loading users...')}</p> : <Table columns={columns} data={filtered} emptyMessage={t('noUsersFound', 'No users found.')} onRowClick={openDetail} />}

      <Modal open={!!editUser} onClose={() => setEditUser(null)} title={t('manageUser', 'Manage User')}>
        {editUser && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-cream-200 bg-cream-50 p-4">
              <p className="font-semibold text-dark-900">{editUser.fullName || editUser.email}</p>
              <p className="text-sm text-dark-500">{editUser.email}</p>
            </div>

            <form onSubmit={handleUpdateRole} className="space-y-3">
              <label className="field-label block">{t('role', 'Role')}</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="w-full rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40">
                <option value="User">{t('User', 'User')}</option>
                <option value="Admin">{t('Admin', 'Admin')}</option>
              </select>
              <Button type="submit" fullWidth>{t('updateRole', 'Update Role')}</Button>
            </form>

            <div className="space-y-3">
              <label className="field-label block">{t('banReason', 'Ban Reason')}</label>
              <textarea value={banReason} onChange={e => setBanReason(e.target.value)} rows={3} className="w-full resize-none rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40" />
              <div className="flex gap-3">
                <Button variant="danger" fullWidth onClick={handleBan}><Ban size={15} /> {t('banUser', 'Ban User')}</Button>
                <Button variant="secondary" fullWidth onClick={handleUnban}><Undo2 size={15} /> {t('unbanUser', 'Unban User')}</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title={t('deleteUser', 'Delete User')} size="sm">
        <p className="mb-5 text-sm text-dark-700">{t('deleteConfirmPrefix', 'Delete')} <strong>{deleteTarget?.fullName || deleteTarget?.email}</strong>?</p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setDeleteTarget(null)}>{t('cancel', 'Cancel')}</Button>
          <Button variant="danger" fullWidth onClick={handleDelete}>{t('delete', 'Delete')}</Button>
        </div>
      </Modal>
    </div>
  )
}
