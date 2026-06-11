import { useEffect, useState } from 'react'
import { Users, BookOpen, Trophy, TrendingUp, HelpCircle, Video } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Card from '../../components/ui/Card'
import { adminService } from '../../services'

const STAT_CARDS = [
  { key: 'totalUsers', label: 'Total Users', icon: Users, color: 'text-brand-500' },
  { key: 'totalUnits', label: 'Total Units', icon: BookOpen, color: 'text-brand-500' },
  { key: 'totalVideoClips', label: 'Videos', icon: Video, color: 'text-accent-500' },
  { key: 'totalQuizzes', label: 'Quizzes', icon: HelpCircle, color: 'text-warning-500' },
  { key: 'totalCompletedPayments', label: 'Payments', icon: Trophy, color: 'text-brand-500' },
  { key: 'activeLast7Days', label: 'Active 7 Days', icon: TrendingUp, color: 'text-accent-500' },
]

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({})
  const [chart, setChart] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const load = async () => {
      const [usersRes, contentRes, quizRes, retentionRes, revenueRes] = await Promise.allSettled([
        adminService.getUserStats(),
        adminService.getContentStats(),
        adminService.getQuizStats(),
        adminService.getRetentionStats(),
        adminService.getRevenueStats(),
      ])

      if (!active) return
      const next = {
        ...(usersRes.value?.data || {}),
        ...(contentRes.value?.data || {}),
        ...(quizRes.value?.data || {}),
        ...(retentionRes.value?.data || {}),
        ...(revenueRes.value?.data || {}),
      }
      setStats(next)
      setChart([
        { label: 'Users', value: next.totalUsers ?? 0 },
        { label: 'Units', value: next.totalUnits ?? 0 },
        { label: 'Words', value: next.totalWords ?? 0 },
        { label: 'Quizzes', value: next.totalQuizzes ?? 0 },
      ])
      setLoading(false)
    }

    load()
    return () => { active = false }
  }, [])

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-dark-900">Dashboard</h1>
        <p className="text-dark-600 text-sm mt-0.5">Welcome to the CineLingo admin panel</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {STAT_CARDS.map(({ key, label, icon: Icon, color }) => (
          <Card key={key}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-dark-500 uppercase tracking-normal">{label}</span>
              <Icon size={18} className={color} />
            </div>
            <p className="text-3xl font-bold font-display text-dark-900">
              {loading ? '-' : Number(stats[key] ?? 0).toLocaleString()}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="font-semibold text-dark-900 mb-5 font-display">Content Overview</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chart}>
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#d4873a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
