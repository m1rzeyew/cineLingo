import { Users, BookOpen, Trophy, TrendingUp, GraduationCap, HelpCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import Card from '../../components/ui/Card'

const MOCK_STATS = {
  totalUsers:   1248,
  totalUnits:   24,
  totalLevels:  6,
  totalQuizzes: 3892,
  premiumUsers: 341,
  activeToday:  87,
}

const USER_CHART = [
  {date:'May 28',count:12},{date:'May 29',count:19},{date:'May 30',count:8},
  {date:'May 31',count:24},{date:'Jun 1', count:31},{date:'Jun 2', count:18},
  {date:'Jun 3', count:27},{date:'Jun 4', count:22},
]

const SCORE_CHART = [
  {levelName:'Beginner',avgScore:88},{levelName:'Elementary',avgScore:76},
  {levelName:'Pre-Int',  avgScore:71},{levelName:'Intermediate',avgScore:68},
  {levelName:'Upper-Int',avgScore:62},{levelName:'Advanced',   avgScore:74},
]

const STAT_CARDS = [
  { key:'totalUsers',   label:'Total Users',   icon:Users,         color:'text-blue-500'  },
  { key:'totalUnits',   label:'Total Units',   icon:BookOpen,      color:'text-green-500' },
  { key:'totalLevels',  label:'Total Levels',  icon:GraduationCap, color:'text-purple-500'},
  { key:'totalQuizzes', label:'Quizzes Taken', icon:HelpCircle,    color:'text-amber-500' },
  { key:'premiumUsers', label:'Premium Users', icon:Trophy,        color:'text-brand-500' },
  { key:'activeToday',  label:'Active Today',  icon:TrendingUp,    color:'text-teal-500'  },
]

export default function AdminDashboardPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-dark-900">Dashboard</h1>
        <p className="text-dark-600 text-sm mt-0.5">Welcome to the CineLingo admin panel</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {STAT_CARDS.map(({ key, label, icon:Icon, color }) => (
          <Card key={key}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-dark-500 uppercase tracking-wide">{label}</span>
              <Icon size={18} className={color} />
            </div>
            <p className="text-3xl font-bold font-display text-dark-900">
              {(MOCK_STATS[key] ?? 0).toLocaleString()}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-semibold text-dark-900 mb-5 font-display">User Registrations (Last 8 days)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={USER_CHART}>
              <XAxis dataKey="date" tick={{ fontSize:11 }} />
              <YAxis tick={{ fontSize:11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#d4873a" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h2 className="font-semibold text-dark-900 mb-5 font-display">Avg Quiz Score by Level</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={SCORE_CHART}>
              <XAxis dataKey="levelName" tick={{ fontSize:10 }} />
              <YAxis domain={[0,100]} tick={{ fontSize:11 }} />
              <Tooltip />
              <Bar dataKey="avgScore" fill="#d4873a" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
