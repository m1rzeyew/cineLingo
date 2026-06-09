import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Flame, Star, Lock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { StatCard } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import PaywallModal from '../../components/common/PaywallModal'
import { cn } from '../../utils/helpers'

const MOCK_UNITS = [
  { id:'1', title:'The Art of Conversation',        levelName:'Intermediate',       wordCount:6,  isCompleted:false, requiresPremium:false },
  { id:'2', title:'City Life & Urban Stories',      levelName:'Intermediate',       wordCount:12, isCompleted:true,  requiresPremium:false },
  { id:'3', title:'Science & Discovery',            levelName:'Upper-Intermediate', wordCount:18, isCompleted:false, requiresPremium:true  },
  { id:'4', title:'Food Culture Around the World',  levelName:'Intermediate',       wordCount:9,  isCompleted:false, requiresPremium:true  },
]

const MOCK_QUIZ_HISTORY = [
  { id:'1', unitTitle:'City Life & Urban Stories', score:85, correctAnswers:17, totalQuestions:20 },
  { id:'2', unitTitle:'The Art of Conversation',   score:60, correctAnswers:12, totalQuestions:20 },
  { id:'3', unitTitle:'Basics of Grammar',         score:95, correctAnswers:19, totalQuestions:20 },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [paywallOpen, setPaywallOpen] = useState(false)

  const handleContinue = (unit) => {
    if (unit.requiresPremium && !user?.isPremium) { setPaywallOpen(true); return }
    navigate(`/units/${unit.id}`)
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8 animate-fade-in">

      {/* ── Welcome ─────────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-dark-900 flex items-center gap-2">
          Welcome back, {user?.firstName}! <span>👋</span>
        </h1>
        <p className="text-dark-400 mt-1 text-sm">Continue your English learning journey</p>
      </div>

      {/* ── Stats ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Words Saved"     value={user?.wordsSaved     ?? 0} />
        <StatCard label="Total Units"     value={MOCK_UNITS.length}         />
        <StatCard label="Units Completed" value={user?.unitsCompleted ?? 1} />
        <StatCard label="English Level"   value={user?.englishLevel   ?? 4} />
      </div>

      {/* ── Streak banner ───────────────────────────────────────── */}
      <div className="flex items-center gap-4 bg-dark-900 rounded-2xl px-5 py-4 mb-10">
        <div className="w-10 h-10 bg-brand-500/20 rounded-xl flex items-center justify-center shrink-0">
          <Flame size={20} className="text-brand-400" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-white text-sm">
            {user?.streak ?? 7} day streak! 🔥 Keep it up!
          </p>
          <p className="text-white/40 text-xs mt-0.5">You're on fire — don't break the chain.</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Star size={14} className="text-brand-400 fill-brand-400" />
          <span className="text-brand-400 font-bold text-sm font-display">
            {(user?.totalPoints ?? 1240).toLocaleString()} pts
          </span>
        </div>
      </div>

      {/* ── Continue Learning ───────────────────────────────────── */}
      <h2 className="text-lg font-semibold font-display text-dark-900 mb-4">Continue Learning</h2>
      <div className="space-y-3 mb-10">
        {MOCK_UNITS.map((unit) => {
          const locked = unit.requiresPremium && !user?.isPremium
          return (
            <div
              key={unit.id}
              className="flex items-center gap-4 bg-white rounded-2xl border border-cream-200 px-5 py-4
                         hover:shadow-card-hover hover:border-cream-300 transition-all duration-200"
            >
              {/* Thumbnail */}
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
                locked ? 'bg-dark-700' : 'bg-cream-100',
              )}>
                {locked ? <Lock size={18} className="text-white/40" /> : <span className="text-2xl">🎬</span>}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-dark-900 truncate">{unit.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="brand">{unit.levelName}</Badge>
                  <span className="text-xs text-dark-400">{unit.wordCount} words</span>
                  {unit.isCompleted && <Badge variant="success">✓ Done</Badge>}
                  {locked && <Badge variant="warning">🔒 Premium</Badge>}
                </div>
              </div>

              {/* Action */}
              <Button
                size="sm"
                variant={unit.isCompleted ? 'secondary' : 'primary'}
                onClick={() => handleContinue(unit)}
              >
                {locked ? '🔒 Unlock' : unit.isCompleted ? 'Review' : 'Continue'}
              </Button>
            </div>
          )
        })}
      </div>

      {/* ── Recent Quizzes ──────────────────────────────────────── */}
      <h2 className="text-lg font-semibold font-display text-dark-900 mb-4">Recent Quizzes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {MOCK_QUIZ_HISTORY.map((q) => {
          const color = q.score >= 80 ? 'text-green-600' : q.score >= 50 ? 'text-brand-500' : 'text-red-500'
          return (
            <div key={q.id} className="bg-white rounded-2xl border border-cream-200 p-5 hover:shadow-card transition-all">
              <p className="font-medium text-dark-900 text-sm truncate mb-3">{q.unitTitle}</p>
              <p className={`text-3xl font-bold font-display ${color}`}>{q.score}%</p>
              <p className="text-xs text-dark-400 mt-1">{q.correctAnswers}/{q.totalQuestions} correct</p>
            </div>
          )
        })}
      </div>

      <PaywallModal
        open={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        onSuccess={() => setPaywallOpen(false)}
      />
    </div>
  )
}
