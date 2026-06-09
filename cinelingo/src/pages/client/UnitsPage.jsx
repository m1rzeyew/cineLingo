import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Lock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Badge from '../../components/ui/Badge'
import Input from '../../components/ui/Input'
import PaywallModal from '../../components/common/PaywallModal'
import { cn } from '../../utils/helpers'

const MOCK_UNITS = [
  { id:'1', title:'The Art of Conversation',        levelName:'Intermediate',       wordCount:6,  isCompleted:false, requiresPremium:false },
  { id:'2', title:'City Life & Urban Stories',      levelName:'Intermediate',       wordCount:12, isCompleted:true,  requiresPremium:false },
  { id:'3', title:'Science & Discovery',            levelName:'Upper-Intermediate', wordCount:18, isCompleted:false, requiresPremium:true  },
  { id:'4', title:'Food Culture Around the World',  levelName:'Intermediate',       wordCount:9,  isCompleted:false, requiresPremium:true  },
  { id:'5', title:'Music & Emotions',               levelName:'Beginner',           wordCount:7,  isCompleted:true,  requiresPremium:false },
  { id:'6', title:'Travel & Adventure',             levelName:'Upper-Intermediate', wordCount:15, isCompleted:false, requiresPremium:true  },
]

export default function UnitsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [paywallOpen, setPaywallOpen] = useState(false)

  const units = MOCK_UNITS.filter(u =>
    search === '' || u.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleUnitClick = (unit) => {
    if (unit.requiresPremium && !user?.isPremium) { setPaywallOpen(true); return }
    navigate(`/units/${unit.id}`)
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-dark-900">Units</h1>
          <p className="text-dark-600 text-sm mt-0.5">{units.length} learning units</p>
        </div>
        <div className="w-56">
          <Input placeholder="Search units…" prefix={<Search size={14} />}
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {units.map((unit) => {
          const locked = unit.requiresPremium && !user?.isPremium
          return (
            <button key={unit.id} onClick={() => handleUnitClick(unit)}
              className={cn(
                'group relative bg-white rounded-2xl border border-cream-200 overflow-hidden text-left',
                'hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200',
                locked && 'opacity-80',
              )}
            >
              <div className="aspect-video bg-cream-100 relative flex items-center justify-center text-5xl">
                🎬
                {locked && (
                  <div className="absolute inset-0 bg-dark-900/50 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <Lock size={20} className="text-white" />
                    </div>
                  </div>
                )}
                {unit.isCompleted && (
                  <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ✓ Done
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="font-semibold text-dark-900 line-clamp-2">{unit.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="brand">{unit.levelName}</Badge>
                  <span className="text-xs text-dark-600">{unit.wordCount} words</span>
                  {locked && <Badge variant="warning">Premium</Badge>}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <PaywallModal open={paywallOpen} onClose={() => setPaywallOpen(false)} onSuccess={() => setPaywallOpen(false)} />
    </div>
  )
}
