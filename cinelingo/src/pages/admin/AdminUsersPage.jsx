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
  const navigate = useNavigate()
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

  const openDetail = (user) => {
    if (user?.id) navigate(`/admin/users/${user.id}`)
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

      {loading ? <p className="text-sm text-dark-500">Loading users...</p> : <Table columns={columns} data={filtered} emptyMessage="No users found." onRowClick={openDetail} />}
    </div>
  )
}
