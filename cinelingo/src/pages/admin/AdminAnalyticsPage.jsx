import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import Card from '../../components/ui/Card'
import { adminService } from '../../services'

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const load = async () => {
      const [quizRes, retentionRes, revenueRes] = await Promise.allSettled([
        adminService.getQuizStats(),
        adminService.getRetentionStats(),
        adminService.getRevenueStats(),
      ])

      if (!active) return
      setStats({
        ...(quizRes.value?.data || {}),
        ...(retentionRes.value?.data || {}),
        ...(revenueRes.value?.data || {}),
      })
      setLoading(false)
    }

    load()
    return () => { active = false }
  }, [])

  const summary = [
    { label: 'Total Revenue', value: `$${Number(stats.totalRevenue ?? 0).toLocaleString()}` },
    { label: 'Revenue This Month', value: `$${Number(stats.revenueThisMonth ?? 0).toLocaleString()}` },
    { label: 'Retention 7 Days', value: `${Math.round(stats.retentionRate7Days ?? 0)}%` },
    { label: 'Avg Quiz Score', value: `${Math.round(stats.averageScore ?? 0)}%` },
  ]

  const chart = [
    { label: 'Attempts', value: stats.totalAttempts ?? 0 },
    { label: 'Passed', value: stats.totalPassed ?? 0 },
    { label: 'Failed', value: stats.totalFailed ?? 0 },
    { label: 'Active 7d', value: stats.activeLast7Days ?? 0 },
    { label: 'Active 30d', value: stats.activeLast30Days ?? 0 },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-display text-dark-900">Analytics</h1>
        <p className="text-dark-400 text-sm mt-0.5">Revenue, retention, and learning performance</p>
      </div>

      {loading && <p className="text-sm text-dark-500">Loading analytics...</p>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summary.map(({ label, value }) => (
          <Card key={label}>
            <p className="text-xs text-dark-400 uppercase tracking-normal mb-2">{label}</p>
            <p className="text-2xl font-bold font-display text-dark-900">{loading ? '-' : value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="font-semibold font-display text-dark-900 mb-5">Engagement Overview</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ede5d5" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#888' }} />
            <YAxis tick={{ fontSize: 11, fill: '#888' }} />
            <Tooltip />
            <Bar dataKey="value" fill="#d4873a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
