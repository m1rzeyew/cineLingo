import { useEffect, useState } from 'react'
import { Bell, Send, Users, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminService } from '../../services'
import { getApiErrorMessage } from '../../utils/helpers'

export default function AdminNotificationsPage() {
  const [target, setTarget] = useState('all')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [actionUrl, setActionUrl] = useState('')
  const [selected, setSelected] = useState([])
  const [users, setUsers] = useState([])
  const [sending, setSending] = useState(false)

  useEffect(() => {
    let active = true

    const loadUsers = async () => {
      try {
        const res = await adminService.getUsers()
        if (active) setUsers(Array.isArray(res.data) ? res.data : [])
      } catch {
        if (active) setUsers([])
      }
    }

    loadUsers()
    return () => { active = false }
  }, [])

  const toggleUser = (id) =>
    setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  const sendOne = (userId = null) => adminService.sendNotification({
    userId,
    title,
    message,
    actionUrl: actionUrl || null,
  })

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) return
    if (target === 'selected' && selected.length === 0) return

    setSending(true)
    try {
      if (target === 'all') await sendOne(null)
      else await Promise.all(selected.map(id => sendOne(id)))

      setTitle('')
      setMessage('')
      setActionUrl('')
      setSelected([])
      toast.success('Notification sent.')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not send notification.'))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-900 flex items-center gap-2">
          <Bell size={22} className="text-brand-500" />
          Notifications
        </h1>
        <p className="text-dark-500 text-sm mt-1">Send notifications to users</p>
      </div>

      <div className="bg-white rounded-2xl border border-cream-200 p-6 mb-8">
        <h2 className="text-base font-semibold text-dark-900 mb-4">Send Notification</h2>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setTarget('all')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${target === 'all' ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-dark-600 border-cream-200 hover:border-brand-300'}`}>
            <Users size={15} /> All Users
          </button>
          <button onClick={() => setTarget('selected')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${target === 'selected' ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-dark-600 border-cream-200 hover:border-brand-300'}`}>
            <User size={15} /> Selected Users
          </button>
        </div>

        {target === 'selected' && (
          <div className="flex flex-wrap gap-2 mb-4 p-3 bg-cream-50 rounded-xl border border-cream-200 max-h-44 overflow-y-auto">
            {users.map(u => (
              <button key={u.id} onClick={() => toggleUser(u.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${selected.includes(u.id) ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-dark-600 border-cream-200 hover:border-brand-300'}`}>
                {u.fullName || u.email}
              </button>
            ))}
          </div>
        )}

        <input type="text" placeholder="Notification title" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-cream-200 rounded-xl px-4 py-2.5 text-sm text-dark-900 bg-white mb-3 outline-none focus:border-brand-400 transition-colors" />
        <textarea placeholder="Notification message" value={message} onChange={e => setMessage(e.target.value)} rows={3} className="w-full border border-cream-200 rounded-xl px-4 py-2.5 text-sm text-dark-900 bg-white mb-3 outline-none focus:border-brand-400 transition-colors resize-none" />
        <input type="text" placeholder="Optional action URL" value={actionUrl} onChange={e => setActionUrl(e.target.value)} className="w-full border border-cream-200 rounded-xl px-4 py-2.5 text-sm text-dark-900 bg-white mb-4 outline-none focus:border-brand-400 transition-colors" />

        <div className="flex items-center justify-end">
          <button onClick={handleSend} disabled={sending || !title.trim() || !message.trim() || (target === 'selected' && selected.length === 0)} className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-medium hover:bg-brand-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <Send size={15} /> {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}
