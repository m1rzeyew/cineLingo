import { useState } from 'react'
import { Bell, Send, Users, User } from 'lucide-react'

const MOCK_SENT = [
  { id: 1, title: 'New unit available!',     message: 'City Life & Urban Stories unit is now live.',  target: 'All Users',      date: '2024-06-01', count: 1248 },
  { id: 2, title: 'Weekly challenge starts', message: 'Join this week\'s vocabulary challenge.',        target: 'All Users',      date: '2024-05-28', count: 1248 },
  { id: 3, title: 'Premium reminder',        message: 'Your trial ends in 3 days. Upgrade now.',       target: 'Selected Users', date: '2024-05-25', count: 341  },
]

const MOCK_USERS = [
  { id: 1, name: 'Nigar T.',  email: 'nigar@example.com'  },
  { id: 2, name: 'Farid M.',  email: 'farid@example.com'  },
  { id: 3, name: 'Leyla R.',  email: 'leyla@example.com'  },
  { id: 4, name: 'Omar K.',   email: 'omar@example.com'   },
  { id: 5, name: 'Sara B.',   email: 'sara@example.com'   },
]

export default function AdminNotificationsPage() {
  const [target,   setTarget]   = useState('all')
  const [title,    setTitle]    = useState('')
  const [message,  setMessage]  = useState('')
  const [selected, setSelected] = useState([])
  const [sent,     setSent]     = useState(MOCK_SENT)
  const [success,  setSuccess]  = useState(false)

  const toggleUser = (id) =>
    setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  const handleSend = () => {
    if (!title.trim() || !message.trim()) return
    if (target === 'selected' && selected.length === 0) return

    const newNotif = {
      id:      Date.now(),
      title,
      message,
      target:  target === 'all' ? 'All Users' : 'Selected Users',
      date:    new Date().toISOString().slice(0, 10),
      count:   target === 'all' ? 1248 : selected.length,
    }

    setSent(p => [newNotif, ...p])
    setTitle('')
    setMessage('')
    setSelected([])
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
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

      {/* Send Form */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6 mb-8">
        <h2 className="text-base font-semibold text-dark-900 mb-4">Send Notification</h2>

        {/* Target toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTarget('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              target === 'all'
                ? 'bg-brand-500 text-white border-brand-500'
                : 'bg-white text-dark-600 border-cream-200 hover:border-brand-300'
            }`}
          >
            <Users size={15} /> All Users
          </button>
          <button
            onClick={() => setTarget('selected')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              target === 'selected'
                ? 'bg-brand-500 text-white border-brand-500'
                : 'bg-white text-dark-600 border-cream-200 hover:border-brand-300'
            }`}
          >
            <User size={15} /> Selected Users
          </button>
        </div>

        {/* User select */}
        {target === 'selected' && (
          <div className="flex flex-wrap gap-2 mb-4 p-3 bg-cream-50 rounded-xl border border-cream-200">
            {MOCK_USERS.map(u => (
              <button
                key={u.id}
                onClick={() => toggleUser(u.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  selected.includes(u.id)
                    ? 'bg-brand-500 text-white border-brand-500'
                    : 'bg-white text-dark-600 border-cream-200 hover:border-brand-300'
                }`}
              >
                {u.name}
              </button>
            ))}
          </div>
        )}

        {/* Title */}
        <input
          type="text"
          placeholder="Notification title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border border-cream-200 rounded-xl px-4 py-2.5 text-sm text-dark-900 bg-white mb-3 outline-none focus:border-brand-400 transition-colors"
        />

        {/* Message */}
        <textarea
          placeholder="Notification message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={3}
          className="w-full border border-cream-200 rounded-xl px-4 py-2.5 text-sm text-dark-900 bg-white mb-4 outline-none focus:border-brand-400 transition-colors resize-none"
        />

        <div className="flex items-center justify-between">
          {success && (
            <span className="text-sm text-green-600 font-medium">✓ Notification sent!</span>
          )}
          {!success && <span />}
          <button
            onClick={handleSend}
            disabled={!title.trim() || !message.trim() || (target === 'selected' && selected.length === 0)}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-medium hover:bg-brand-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={15} /> Send
          </button>
        </div>
      </div>

      {/* Sent history */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6">
        <h2 className="text-base font-semibold text-dark-900 mb-4">Sent Notifications</h2>
        <div className="space-y-3">
          {sent.map(n => (
            <div key={n.id} className="flex items-start gap-4 p-4 rounded-xl border border-cream-100 bg-cream-50">
              <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bell size={16} className="text-brand-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-dark-900">{n.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    n.target === 'All Users'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-amber-50 text-amber-600'
                  }`}>
                    {n.target}
                  </span>
                </div>
                <p className="text-xs text-dark-500 mb-1">{n.message}</p>
                <span className="text-xs text-dark-400">{n.date} · {n.count} recipients</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}