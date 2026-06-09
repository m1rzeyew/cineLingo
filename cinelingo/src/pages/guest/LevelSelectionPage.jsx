import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Lock, Film } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import { cn } from '../../utils/helpers'

const LEVELS = [
  { id:'1', order:1, name:'Beginner',           emoji:'🌱', desc:'Start from zero · A1',           free:true  },
  { id:'2', order:2, name:'Elementary',          emoji:'📖', desc:'Build foundations · A2',          free:false },
  { id:'3', order:3, name:'Pre-Intermediate',    emoji:'🎯', desc:'Connect ideas · B1',              free:false },
  { id:'4', order:4, name:'Intermediate',        emoji:'🎬', desc:'Express yourself · B1+',          free:false },
  { id:'5', order:5, name:'Upper-Intermediate',  emoji:'🏆', desc:'Think in English · B2',           free:false },
  { id:'6', order:6, name:'Advanced',            emoji:'⭐', desc:'Near-native fluency · C1',        free:false },
]

export default function LevelSelectionPage() {
  const { selectLevel, loading } = useAuth()
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  const handleConfirm = async () => {
    if (!selected) return
    const { success } = await selectLevel(selected)
    if (success) navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-2 justify-center mb-10">
          <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
            <Film size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-white text-xl">
            Cine<span className="text-brand-400">Lingo</span>
          </span>
        </div>

        <h1 className="text-3xl font-bold font-display text-white text-center mb-2">
          Choose Your Level
        </h1>
        <p className="text-white/40 text-center mb-10 text-sm">
          Select your current English level. You can change it later from your profile.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {LEVELS.map((lvl) => {
            const isSelected = selected === lvl.id
            return (
              <button
                key={lvl.id}
                onClick={() => setSelected(lvl.id)}
                className={cn(
                  'relative rounded-2xl border p-5 text-left transition-all duration-200',
                  'hover:-translate-y-0.5 hover:shadow-xl',
                  isSelected
                    ? 'border-brand-500 bg-brand-500/15 shadow-amber'
                    : 'border-white/10 bg-dark-800 hover:border-white/25',
                )}
              >
                {lvl.free && (
                  <span className="absolute top-2 right-2 bg-brand-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    FREE
                  </span>
                )}
                {isSelected && (
                  <div className="absolute top-2.5 right-2 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center">
                    <Check size={11} className="text-white" />
                  </div>
                )}
                <span className="text-2xl mb-3 block">{lvl.emoji}</span>
                <p className="font-semibold text-white text-sm">{lvl.name}</p>
                <p className="text-xs text-white/40 mt-0.5">{lvl.desc}</p>
                {!lvl.free && !isSelected && (
                  <div className="flex items-center gap-1 mt-2">
                    <Lock size={9} className="text-white/30" />
                    <span className="text-[10px] text-white/30">Premium</span>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <div className="flex justify-center mt-8">
          <Button
            size="lg"
            variant="brand"
            disabled={!selected || loading}
            loading={loading}
            onClick={handleConfirm}
            className="min-w-[220px] shadow-amber"
          >
            Start Learning →
          </Button>
        </div>

        <p className="text-center text-xs text-white/25 mt-4">
          Beginner level is completely free. Premium unlocks all six levels.
        </p>
      </div>
    </div>
  )
}
