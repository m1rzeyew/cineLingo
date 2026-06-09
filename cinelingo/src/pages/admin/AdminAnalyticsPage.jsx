import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const REVENUE = [
  { month:'Jan', revenue:1200, subs:48 }, { month:'Feb', revenue:1800, subs:72 },
  { month:'Mar', revenue:2400, subs:96 }, { month:'Apr', revenue:2100, subs:84 },
  { month:'May', revenue:3100, subs:124 },{ month:'Jun', revenue:4200, subs:168 },
  { month:'Jul', revenue:3900, subs:156 },{ month:'Aug', revenue:5100, subs:204 },
]

const RETENTION = [
  { week:'W1',  d1:100, d7:68, d30:41 }, { week:'W2',  d1:100, d7:71, d30:44 },
  { week:'W3',  d1:100, d7:65, d30:38 }, { week:'W4',  d1:100, d7:74, d30:47 },
  { week:'W5',  d1:100, d7:70, d30:45 }, { week:'W6',  d1:100, d7:78, d30:52 },
]

const QUIZ_PERF = [
  { level:'Beginner',         avgScore:88, passRate:94, attempts:1240 },
  { level:'Elementary',       avgScore:76, passRate:82, attempts:890  },
  { level:'Pre-Int.',         avgScore:71, passRate:76, attempts:640  },
  { level:'Intermediate',     avgScore:68, passRate:72, attempts:520  },
  { level:'Upper-Int.',       avgScore:62, passRate:65, attempts:310  },
  { level:'Advanced',         avgScore:74, passRate:78, attempts:140  },
]

const TOP_UNITS = [
  { title:'The Art of Conversation',       views:2840, completion:78, avgScore:82 },
  { title:'City Life & Urban Stories',     views:2310, completion:71, avgScore:75 },
  { title:'Music & Emotions',             views:1980, completion:84, avgScore:79 },
  { title:'Food Culture Around the World', views:1540, completion:65, avgScore:70 },
  { title:'Science & Discovery',          views:1120, completion:58, avgScore:66 },
]

const SUMMARY_STATS = [
  { label:'Monthly Revenue',  value:'$5,100',  change:'+23%',  up:true  },
  { label:'Active Subs',      value:'204',     change:'+31%',  up:true  },
  { label:'Avg Retention D7', value:'71%',     change:'+6%',   up:true  },
  { label:'Avg Quiz Score',   value:'73%',     change:'-2%',   up:false },
]

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-display text-dark-900">Analytics</h1>
        <p className="text-dark-400 text-sm mt-0.5">Revenue, retention, and learning performance</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {SUMMARY_STATS.map(({ label, value, change, up }) => (
          <Card key={label}>
            <p className="text-xs text-dark-400 uppercase tracking-wide mb-2">{label}</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold font-display text-dark-900">{value}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                up ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
              }`}>
                {change}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Revenue + Retention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-semibold font-display text-dark-900 mb-5">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={REVENUE}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4873a" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#d4873a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ede5d5" />
              <XAxis dataKey="month" tick={{ fontSize:11, fill:'#888' }} />
              <YAxis tick={{ fontSize:11, fill:'#888' }} tickFormatter={v => `$${v}`} />
              <Tooltip formatter={(v) => [`$${v}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#d4873a" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="font-semibold font-display text-dark-900 mb-5">User Retention</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={RETENTION}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ede5d5" />
              <XAxis dataKey="week" tick={{ fontSize:11, fill:'#888' }} />
              <YAxis domain={[0,100]} tick={{ fontSize:11, fill:'#888' }} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(v) => [`${v}%`]} />
              <Legend wrapperStyle={{ fontSize:11 }} />
              <Line type="monotone" dataKey="d1"  stroke="#1a1a1a" strokeWidth={2} dot={false} name="Day 1" />
              <Line type="monotone" dataKey="d7"  stroke="#d4873a" strokeWidth={2} dot={false} name="Day 7" />
              <Line type="monotone" dataKey="d30" stroke="#c07020" strokeWidth={2} strokeDasharray="4 2" dot={false} name="Day 30" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Quiz performance by level */}
      <Card>
        <h2 className="font-semibold font-display text-dark-900 mb-5">Quiz Performance by Level</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={QUIZ_PERF}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ede5d5" />
              <XAxis dataKey="level" tick={{ fontSize:10, fill:'#888' }} />
              <YAxis domain={[0,100]} tick={{ fontSize:11, fill:'#888' }} />
              <Tooltip />
              <Bar dataKey="avgScore"  fill="#d4873a" radius={[4,4,0,0]} name="Avg Score %" />
              <Bar dataKey="passRate"  fill="#1a1a1a" radius={[4,4,0,0]} name="Pass Rate %" />
            </BarChart>
          </ResponsiveContainer>

          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-2 pb-2 border-b border-cream-200 text-[10px] font-semibold text-dark-400 uppercase tracking-wide">
              <span>Level</span><span className="text-right">Score</span>
              <span className="text-right">Pass</span><span className="text-right">Attempts</span>
            </div>
            {QUIZ_PERF.map((r) => (
              <div key={r.level} className="grid grid-cols-4 gap-2 text-sm items-center py-1">
                <span className="text-dark-700 text-xs truncate">{r.level}</span>
                <span className={`text-right font-medium text-xs ${r.avgScore>=80?'text-green-600':r.avgScore>=65?'text-brand-500':'text-red-500'}`}>
                  {r.avgScore}%
                </span>
                <span className="text-right text-xs text-dark-600">{r.passRate}%</span>
                <span className="text-right text-xs text-dark-400">{r.attempts.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Top content */}
      <Card>
        <h2 className="font-semibold font-display text-dark-900 mb-5">Top Performing Units</h2>
        <div className="space-y-1">
          <div className="grid grid-cols-4 gap-4 pb-2 border-b border-cream-200 text-[10px] font-semibold text-dark-400 uppercase tracking-wide">
            <span className="col-span-2">Unit</span>
            <span className="text-right">Views</span>
            <span className="text-right">Avg Score</span>
          </div>
          {TOP_UNITS.map((u, i) => (
            <div key={u.title} className="grid grid-cols-4 gap-4 py-2.5 border-b border-cream-50 last:border-0 items-center">
              <div className="col-span-2 flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cream-200 text-[10px] text-dark-500 font-bold flex items-center justify-center shrink-0">
                  {i+1}
                </span>
                <span className="text-sm text-dark-900 truncate">{u.title}</span>
              </div>
              <span className="text-right text-sm text-dark-600">{u.views.toLocaleString()}</span>
              <span className={`text-right text-sm font-medium ${u.avgScore>=80?'text-green-600':'text-brand-500'}`}>
                {u.avgScore}%
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
