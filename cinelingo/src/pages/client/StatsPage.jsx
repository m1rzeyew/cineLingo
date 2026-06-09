import { useAuth } from '../../context/AuthContext'
import Card from '../../components/ui/Card'

export default function StatsPage() {
  const { user } = useAuth()

  return (
    <div className="max-w-screen-md mx-auto px-6 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold font-display text-dark-900 mb-6">My Stats</h1>
      <Card>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            ['Total Points',    user?.totalPoints    ?? 1240],
            ['Words Saved',     user?.wordsSaved     ?? 6   ],
            ['Units Completed', user?.unitsCompleted ?? 1   ],
            ['Quizzes Taken',   user?.quizzesTaken   ?? 3   ],
            ['Best Streak',     user?.bestStreak     ?? 14  ],
            ['Current Streak',  user?.streak         ?? 7   ],
          ].map(([label, val]) => (
            <div key={label} className="bg-cream-50 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold font-display text-brand-500">{val}</p>
              <p className="text-xs text-dark-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}