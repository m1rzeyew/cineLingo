import { useEffect, useState } from 'react'
import { Ban, Eye, Search, Edit2, Trash2, Undo2 } from 'lucide-react'
import Table from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import toast from 'react-hot-toast'
import { adminService } from '../../services'
import { formatDate, getApiErrorMessage } from '../../utils/helpers'

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
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [editUser, setEditUser] = useState(null)
  const [detailUser, setDetailUser] = useState(null)
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
      toast.error(getApiErrorMessage(err, 'Could not load users.'))
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

  const openDetail = async (user) => {
    try {
      const res = await adminService.getUserById(user.id)
      setDetailUser(normalizeUser(res.data))
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not load user detail.'))
    }
  }

  const handleUpdateRole = async (e) => {
    e.preventDefault()
    try {
      await adminService.updateUserRole(editUser.id, role)
      setUsers(us => us.map(u => u.id === editUser.id ? { ...u, role } : u))
      toast.success('User role updated.')
      setEditUser(null)
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not update role.'))
    }
  }

  const handleDelete = async () => {
    try {
      await adminService.deleteUser(deleteTarget.id)
      setUsers(us => us.filter(u => u.id !== deleteTarget.id))
      toast.success('User deleted.')
      setDeleteTarget(null)
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not delete user.'))
    }
  }

  const handleBan = async () => {
    try {
      await adminService.banUser(detailUser.id, { reason: banReason })
      toast.success('User banned.')
      setBanReason('')
      await openDetail(detailUser)
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not ban user.'))
    }
  }

  const handleUnban = async () => {
    try {
      await adminService.unbanUser(detailUser.id)
      toast.success('User unbanned.')
      await openDetail(detailUser)
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not unban user.'))
    }
  }

  const columns = [
    { key: 'name', label: 'User', width: '220px',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.fullName} src={row.avatarUrl} size="sm" />
          <div>
            <p className="font-medium text-dark-900 text-sm">{row.fullName}</p>
            <p className="text-xs text-dark-500">{row.email}</p>
          </div>
        </div>
      ) },
    { key: 'role', label: 'Role', width: '90px', render: (_, row) => <Badge variant={row.role === 'Admin' ? 'dark' : 'default'}>{row.role || 'User'}</Badge> },
    { key: 'levelName', label: 'Level', width: '160px', render: (v) => v ? <Badge variant="brand">{v}</Badge> : '-' },
    { key: 'isDeleted', label: 'State', width: '90px', render: (v) => <Badge variant={v ? 'danger' : 'success'}>{v ? 'Deleted' : 'Active'}</Badge> },
    { key: 'createdAt', label: 'Joined', width: '110px', render: (v) => <span className="text-xs text-dark-500">{v ? formatDate(v) : '-'}</span> },
    { key: 'actions', label: '', width: '80px',
      render: (_, row) => (
        <div className="flex gap-1.5">
          <button onClick={() => openDetail(row)} className="p-1.5 rounded-lg hover:bg-brand-50 text-dark-500 hover:text-brand-700 transition-colors"><Eye size={14} /></button>
          <button onClick={() => openRole(row)} className="p-1.5 rounded-lg hover:bg-cream-100 text-dark-500 hover:text-dark-900 transition-colors"><Edit2 size={14} /></button>
          <button onClick={() => setDeleteTarget(row)} className="p-1.5 rounded-lg hover:bg-red-50 text-dark-500 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
        </div>
      ) },
  ]

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-dark-900">Users</h1>
          <p className="text-dark-600 text-sm mt-0.5">{users.length} total users</p>
        </div>
        <div className="w-56">
          <Input placeholder="Search users..." prefix={<Search size={14} />} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? <p className="text-sm text-dark-500">Loading users...</p> : <Table columns={columns} data={filtered} emptyMessage="No users found." />}

      <Modal open={!!editUser} onClose={() => setEditUser(null)} title="Change Role">
        {editUser && (
          <form onSubmit={handleUpdateRole} className="space-y-4">
            <p className="text-sm text-dark-600">Update role for <strong>{editUser.fullName}</strong>.</p>
            <div>
              <label className="text-sm font-medium text-dark-800 block mb-1.5">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-white border border-cream-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40">
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="secondary" fullWidth onClick={() => setEditUser(null)}>Cancel</Button>
              <Button type="submit" fullWidth>Save Changes</Button>
            </div>
          </form>
        )}
      </Modal>

      <Modal open={!!detailUser} onClose={() => setDetailUser(null)} title="User Detail" size="lg">
        {detailUser && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 rounded-2xl border border-cream-200 bg-cream-50 p-4">
              <Avatar name={detailUser.fullName} src={detailUser.avatarUrl} size="md" />
              <div className="min-w-0">
                <h2 className="truncate text-lg font-black tracking-normal text-dark-900">{detailUser.fullName}</h2>
                <p className="truncate text-sm text-dark-500">{detailUser.email}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant={detailUser.role === 'Admin' ? 'dark' : 'default'}>{detailUser.role || 'User'}</Badge>
                  {detailUser.levelName && <Badge variant="brand">{detailUser.levelName}</Badge>}
                  <Badge variant={detailUser.isDeleted ? 'danger' : 'success'}>{detailUser.isDeleted ? 'Deleted' : 'Active'}</Badge>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-cream-200 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-normal text-dark-400">Username</p>
                <p className="mt-1 text-sm font-semibold text-dark-800">{detailUser.userName || '-'}</p>
              </div>
              <div className="rounded-xl border border-cream-200 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-normal text-dark-400">Joined</p>
                <p className="mt-1 text-sm font-semibold text-dark-800">{detailUser.createdAt ? formatDate(detailUser.createdAt) : '-'}</p>
              </div>
              <div className="rounded-xl border border-cream-200 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-normal text-dark-400">Last Login</p>
                <p className="mt-1 text-sm font-semibold text-dark-800">{detailUser.lastLoginAt ? formatDate(detailUser.lastLoginAt) : '-'}</p>
              </div>
              <div className="rounded-xl border border-cream-200 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-normal text-dark-400">User ID</p>
                <p className="mt-1 break-all text-xs font-semibold text-dark-800">{detailUser.id}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-cream-200 bg-white p-4">
              <label className="field-label mb-1.5 block">Ban Reason</label>
              <textarea value={banReason} onChange={e => setBanReason(e.target.value)} rows={3} className="w-full resize-none rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40" />
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="danger" onClick={handleBan}><Ban size={15} /> Ban User</Button>
                <Button variant="secondary" onClick={handleUnban}><Undo2 size={15} /> Unban User</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete User" size="sm">
        <p className="text-dark-700 mb-5 text-sm">Delete <strong>{deleteTarget?.fullName}</strong>? This cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" fullWidth onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
