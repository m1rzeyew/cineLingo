import { useState } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import { Play, BookOpen, ChevronLeft, Clock, Volume2 } from 'lucide-react'
import Button from '../../components/ui/Button'
import Badge  from '../../components/ui/Badge'

const MOCK_UNITS = {
  '1': {
    id:'1', title:'The Art of Conversation', levelName:'Intermediate',
    wordCount:6, duration:24, isCompleted:false, quizId:'1',
    description:'Dive into the nuances of everyday English conversation through authentic cinema dialogue. Learn how native speakers express opinions, emotions, and ideas naturally.',
    vocabulary:[
      { id:'1', english:'eloquent',   translation:'nitiqli, ifadəli'  },
      { id:'2', english:'articulate', translation:'aydın danışmaq'    },
      { id:'3', english:'subtle',     translation:'incə, nəzərə çarpmayan' },
      { id:'4', english:'persuade',   translation:'inandırmaq'        },
      { id:'5', english:'candid',     translation:'açıq, dürüst'      },
      { id:'6', english:'eloquence',  translation:'natiqlik qabiliyyəti' },
    ],
  },
  '2': {
    id:'2', title:'City Life & Urban Stories', levelName:'Intermediate',
    wordCount:12, duration:31, isCompleted:true, quizId:'2',
    description:'Explore the vibrant energy of city life through real urban stories. Master vocabulary for describing places, people, and experiences in modern metropolitan settings.',
    vocabulary:[
      { id:'1', english:'metropolitan', translation:'böyük şəhər'    },
      { id:'2', english:'commute',       translation:'işə getmək'    },
      { id:'3', english:'bustling',      translation:'səs-küylü, canlı' },
    ],
  },
}

export default function UnitDetailPage() {
  const { id }          = useParams()
  const navigate        = useNavigate()
  const ctx             = useOutletContext()
  const setChatOpen     = ctx?.setChatOpen ?? (() => {})
  const [videoOpen, setVideoOpen] = useState(false)

  const unit = MOCK_UNITS[id] ?? MOCK_UNITS['1']

  return (
    <div className="max-w-screen-lg mx-auto px-6 py-8 animate-fade-in">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-dark-600 hover:text-dark-900 mb-6 transition-colors">
        <ChevronLeft size={16} /> Back to Units
      </button>

      {/* ── Hero poster ───────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden bg-dark-900 mb-8 aspect-[21/8]">
        <div className="w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-dark-800 to-dark-900">
          🎬
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 via-dark-900/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-8">
          <div className="flex gap-2 mb-3">
            <Badge variant="dark">{unit.levelName}</Badge>
            {unit.isCompleted && <Badge variant="success">Completed ✓</Badge>}
          </div>
          <h1 className="text-3xl font-bold font-display text-white mb-2">{unit.title}</h1>
          <div className="flex items-center gap-4 text-white/60 text-sm">
            <span className="flex items-center gap-1"><Clock size={13} /> {unit.duration} min</span>
            <span className="flex items-center gap-1"><Volume2 size={13} /> {unit.wordCount} vocabulary words</span>
          </div>
        </div>
        {!videoOpen && (
          <button onClick={() => { setVideoOpen(true); setChatOpen(true) }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                       w-16 h-16 bg-white/20 backdrop-blur-md border border-white/30
                       rounded-full flex items-center justify-center
                       hover:bg-white/30 hover:scale-110 transition-all duration-200">
            <Play size={24} className="text-white ml-1" fill="white" />
          </button>
        )}
      </div>

      {/* ── Video player placeholder ───────────────────────────────── */}
      {videoOpen && (
        <div className="mb-8 rounded-2xl overflow-hidden bg-dark-900 aspect-video flex items-center justify-center">
          <div className="text-center text-white/50">
            <Play size={48} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">Video player — connect your backend to stream</p>
          </div>
        </div>
      )}

      {/* ── Action buttons ─────────────────────────────────────────── */}
      <div className="flex gap-4 mb-10">
        <Button size="lg" className="flex-1"
          variant={videoOpen ? 'secondary' : 'primary'}
          onClick={() => { setVideoOpen(true); setChatOpen(true) }}>
          <Play size={17} /> {videoOpen ? 'Watching…' : 'Watch Video'}
        </Button>
        <Button size="lg" variant="brand" className="flex-1"
          onClick={() => { setChatOpen(true); navigate(`/quiz/${unit.quizId}`) }}>
          <BookOpen size={17} /> Take Quiz
        </Button>
      </div>

      {/* ── Description ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6 mb-6">
        <h2 className="font-semibold text-dark-900 mb-2 font-display">About this unit</h2>
        <p className="text-dark-700 leading-relaxed text-sm">{unit.description}</p>
      </div>

      {/* ── Vocabulary preview ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6">
        <h2 className="font-semibold text-dark-900 mb-4 font-display">Key Vocabulary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {unit.vocabulary.map((word) => (
            <div key={word.id} className="bg-cream-50 rounded-xl p-3">
              <p className="font-medium text-dark-900 text-sm">{word.english}</p>
              <p className="text-xs text-dark-600 mt-0.5">{word.translation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
