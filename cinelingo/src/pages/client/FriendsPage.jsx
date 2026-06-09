import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../../components/ui/Avatar'
import Card   from '../../components/ui/Card'
import { levelLabel } from '../../utils/helpers'

const MOCK_FOLLOWING = [
  { id:'33', userName:'Kamran A.', englishLevel:4 },
  { id:'22', userName:'Nigar H.',  englishLevel:3 },
]
const MOCK_FOLLOWERS = [
  { id:'66', userName:'Farid M.',  englishLevel:4 },
  { id:'55', userName:'Elena V.',  englishLevel:1 },
  { id:'44', userName:'Omar H.',   englishLevel:2 },
]

export default function FriendsPage() {
  const [following, setFollowing] = useState(MOCK_FOLLOWING)

  return (
    <div className="max-w-screen-md mx-auto px-6 py-8 animate-fade-in space-y-5">
      <h1 className="text-2xl font-bold font-display text-dark-900">Friends</h1>

      <Card>
        <h2 className="font-semibold text-dark-900 mb-4 font-display text-lg">
          Following ({following.length})
        </h2>
        <div className="space-y-2">
          {following.length === 0 && (
            <p className="text-dark-400 text-sm text-center py-4">Not following anyone yet</p>
          )}
          {following.map((u) => (
            <div key={u.id} className="flex items-center gap-3 bg-cream-50 rounded-2xl px-4 py-3">
              <Avatar name={u.userName} size="sm" />
              <div className="flex-1">
                <p className="font-medium text-dark-900 text-sm">{u.userName}</p>
                <p className="text-xs text-dark-400">{levelLabel(u.englishLevel)}</p>
              </div>
              <button
                onClick={() => setFollowing(f => f.filter(x => x.id !== u.id))}
                className="text-xs text-dark-400 hover:text-red-500 px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors"
              >
                Unfollow
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold text-dark-900 mb-4 font-display text-lg">
          Followers ({MOCK_FOLLOWERS.length})
        </h2>
        <div className="space-y-2">
          {MOCK_FOLLOWERS.map((u) => (
            <div key={u.id} className="flex items-center gap-3 bg-cream-50 rounded-2xl px-4 py-3">
              <Avatar name={u.userName} size="sm" />
              <div className="flex-1">
                <p className="font-medium text-dark-900 text-sm">{u.userName}</p>
                <p className="text-xs text-dark-400">{levelLabel(u.englishLevel)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}