import { useState } from 'react'
import { Search, Edit2, Trash2 } from 'lucide-react'
import Table  from '../../components/ui/Table'
import Modal  from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Input  from '../../components/ui/Input'
import Badge  from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import toast  from 'react-hot-toast'

const INIT_USERS = [
  { id:'1',  firstName:'Alex',    lastName:'Johnson', email:'alex@demo.com',    role:'Admin', levelName:'Intermediate',       isPremium:false, createdAt:'2024-01-15' },
  { id:'2',  firstName:'Sarah',   lastName:'K.',      email:'sarah@demo.com',   role:'User',  levelName:'Advanced',          isPremium:true,  createdAt:'2024-02-01' },
  { id:'3',  firstName:'Michael', lastName:'R.',      email:'michael@demo.com', role:'User',  levelName:'Upper-Intermediate', isPremium:true,  createdAt:'2024-02-14' },
  { id:'4',  firstName:'Yuki',    lastName:'T.',      email:'yuki@demo.com',    role:'User',  levelName:'Advanced',          isPremium:false, createdAt:'2024-03-05' },
  { id:'5',  firstName:'Farid',   lastName:'M.',      email:'farid@demo.com',   role:'User',  levelName:'Intermediate',       isPremium:false, createdAt:'2024-03-20' },
  { id:'6',  firstName:'Nigar',   lastName:'H.',      email:'nigar@demo.com',   role:'User',  levelName:'Pre-Intermediate',   isPremium:false, createdAt:'2024-04-02' },
]

export default function AdminUsersPage() {
  const [users, setUsers]     = useState(INIT_USERS)
  const [search, setSearch]   = useState('')
  const [editUser, setEditUser]   = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = users.filter(u =>
    search==='' ||
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  )

  const handleUpdate = (e) => {
    e.preventDefault()
    const fd   = new FormData(e.target)
    const body = Object.fromEntries(fd)
    setUsers(us => us.map(u => u.id===editUser.id ? {...u,...body} : u))
    toast.success('User updated!')
    setEditUser(null)
  }

  const handleDelete = () => {
    setUsers(us => us.filter(u => u.id !== deleteTarget.id))
    toast.success('User deleted')
    setDeleteTarget(null)
  }

  const columns = [
    { key:'name', label:'User', width:'220px',
      render:(_,row) => (
        <div className="flex items-center gap-3">
          <Avatar name={`${row.firstName} ${row.lastName}`} size="sm" />
          <div>
            <p className="font-medium text-dark-900 text-sm">{row.firstName} {row.lastName}</p>
            <p className="text-xs text-dark-500">{row.email}</p>
          </div>
        </div>
      )},
    { key:'role',      label:'Role',  width:'90px',  render:(_,row) => <Badge variant={row.role==='Admin'?'dark':'default'}>{row.role??'User'}</Badge> },
    { key:'levelName', label:'Level', width:'160px', render:(v) => v ? <Badge variant="brand">{v}</Badge> : '—' },
    { key:'isPremium', label:'Plan',  width:'90px',  render:(v) => <Badge variant={v?'warning':'default'}>{v?'Premium':'Free'}</Badge> },
    { key:'createdAt', label:'Joined',width:'110px', render:(v) => <span className="text-xs text-dark-500">{v}</span> },
    { key:'actions', label:'', width:'80px',
      render:(_,row) => (
        <div className="flex gap-1.5">
          <button onClick={() => setEditUser(row)} className="p-1.5 rounded-lg hover:bg-cream-100 text-dark-500 hover:text-dark-900 transition-colors"><Edit2 size={14}/></button>
          <button onClick={() => setDeleteTarget(row)} className="p-1.5 rounded-lg hover:bg-red-50 text-dark-500 hover:text-red-600 transition-colors"><Trash2 size={14}/></button>
        </div>
      )},
  ]

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-dark-900">Users</h1>
          <p className="text-dark-600 text-sm mt-0.5">{users.length} total users</p>
        </div>
        <div className="w-56">
          <Input placeholder="Search users…" prefix={<Search size={14}/>} value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
      </div>

      <Table columns={columns} data={filtered} emptyMessage="No users found." />

      <Modal open={!!editUser} onClose={() => setEditUser(null)} title="Edit User">
        {editUser && (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="First Name" name="firstName" defaultValue={editUser.firstName} />
              <Input label="Last Name"  name="lastName"  defaultValue={editUser.lastName}  />
            </div>
            <Input label="Email" name="email" type="email" defaultValue={editUser.email} />
            <div>
              <label className="text-sm font-medium text-dark-800 block mb-1.5">Role</label>
              <select name="role" defaultValue={editUser.role??'User'}
                className="w-full bg-white border border-cream-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40">
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

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete User" size="sm">
        <p className="text-dark-700 mb-5 text-sm">Delete <strong>{deleteTarget?.firstName} {deleteTarget?.lastName}</strong>? This cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" fullWidth onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
