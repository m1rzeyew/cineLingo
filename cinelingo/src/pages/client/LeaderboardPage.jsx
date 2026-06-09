import { useState } from 'react'
import { Trophy } from 'lucide-react'

const WEEKLY = [
  { rank: 1, name: 'Nigar T.',  initials: 'NT', score: 980,  isMe: false },
  { rank: 2, name: 'Alex J.',   initials: 'AJ', score: 850,  isMe: true  },
  { rank: 3, name: 'Farid M.',  initials: 'FM', score: 790,  isMe: false },
  { rank: 4, name: 'Leyla R.',  initials: 'LR', score: 730,  isMe: false },
  { rank: 5, name: 'Omar K.',   initials: 'OK', score: 640,  isMe: false },
  { rank: 6, name: 'Sara B.',   initials: 'SB', score: 510,  isMe: false },
  { rank: 7, name: 'Rauf A.',   initials: 'RA', score: 430,  isMe: false },
]

const ALL_TIME = [
  { rank: 1, name: 'Kamran H.', initials: 'KH', score: 12400, isMe: false },
  { rank: 2, name: 'Nigar T.',  initials: 'NT', score: 10800, isMe: false },
  { rank: 3, name: 'Alex J.',   initials: 'AJ', score: 9500,  isMe: true  },
  { rank: 4, name: 'Farid M.',  initials: 'FM', score: 7200,  isMe: false },
  { rank: 5, name: 'Leyla R.',  initials: 'LR', score: 6100,  isMe: false },
  { rank: 6, name: 'Omar K.',   initials: 'OK', score: 5300,  isMe: false },
  { rank: 7, name: 'Sara B.',   initials: 'SB', score: 4100,  isMe: false },
]

const rankLabel = (rank) => {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return rank
}

export default function LeaderboardPage() {
  const [tab, setTab] = useState('weekly')
  const data = tab === 'weekly' ? WEEKLY : ALL_TIME
  const maxScore = data[0].score

  return (
    <div className="max-w-lg mx-auto px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold font-display text-dark-900 flex items-center gap-2">
          <Trophy size={20} className="text-brand-500" />
          Leaderboard
        </h1>
        <div className="flex gap-0.5 bg-cream-100 rounded-lg p-0.5 text-xs">
          {[
            { key: 'weekly',  label: 'Weekly'   },
            { key: 'alltime', label: 'All Time' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-3 py-1 rounded-md transition-all ${
                tab === key
                  ? 'bg-white text-dark-900 font-medium shadow-sm'
                  : 'text-dark-500 hover:text-dark-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {data.map((user) => (
          <div
            key={user.rank}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all ${
              user.isMe
                ? 'border-2 border-brand-400 bg-brand-50'
                : 'border border-cream-200 bg-white'
            }`}
          >
            <span className="w-6 text-center text-sm leading-none">
              {rankLabel(user.rank)}
            </span>

            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
              {user.initials}
            </div>

            <span className="flex-1 font-medium text-dark-800">
              {user.name}
              {user.isMe && (
                <span className="ml-1 text-xs text-brand-500 font-normal">(you)</span>
              )}
            </span>

            <div className="w-20 h-1.5 bg-cream-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.round((user.score / maxScore) * 100)}%` }}
              />
            </div>

            <span className="text-xs font-semibold text-dark-600 w-16 text-right tabular-nums">
              {user.score.toLocaleString()} pts
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}