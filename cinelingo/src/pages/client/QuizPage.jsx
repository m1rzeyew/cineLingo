import { useState } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react'
import Button from '../../components/ui/Button'
import { cn } from '../../utils/helpers'

const MOCK_QUESTIONS = [
  { id:'q1', text:'Choose the correct meaning of "eloquent":', options:[
    { id:'a', text:'Unable to speak clearly'   },
    { id:'b', text:'Well-spoken and expressive' },
    { id:'c', text:'Very loud and noisy'        },
    { id:'d', text:'Shy and reserved'           },
  ], correct:'b' },
  { id:'q2', text:'Which sentence uses "subtle" correctly?', options:[
    { id:'a', text:'The music was subtle — everyone could hear it from miles away.' },
    { id:'b', text:'She gave a subtle hint that she wanted to leave.'               },
    { id:'c', text:'He made a subtle explosion in the lab.'                         },
    { id:'d', text:'The elephant was subtle as it walked through the forest.'       },
  ], correct:'b' },
  { id:'q3', text:'What does "persuade" mean?', options:[
    { id:'a', text:'To confuse someone'                     },
    { id:'b', text:'To convince someone to do something'    },
    { id:'c', text:'To ignore someone completely'           },
    { id:'d', text:'To argue aggressively'                  },
  ], correct:'b' },
  { id:'q4', text:'Fill in the blank: "She was _____ in her speech, choosing each word carefully."', options:[
    { id:'a', text:'careless'   },
    { id:'b', text:'candid'     },
    { id:'c', text:'articulate' },
    { id:'d', text:'vague'      },
  ], correct:'c' },
  { id:'q5', text:'Which word is a synonym for "candid"?', options:[
    { id:'a', text:'Dishonest' },
    { id:'b', text:'Honest'    },
    { id:'c', text:'Timid'     },
    { id:'d', text:'Rude'      },
  ], correct:'b' },
]

export default function QuizPage() {
  const navigate       = useNavigate()
  const ctx            = useOutletContext()
  const setChatOpen    = ctx?.setChatOpen ?? (() => {})
  const [current, setCurrent]   = useState(0)
  const [answers, setAnswers]   = useState({})
  const [submitted, setSubmitted] = useState(false)

  const q        = MOCK_QUESTIONS[current]
  const total    = MOCK_QUESTIONS.length
  const progress = Math.round(((current + 1) / total) * 100)

  const handleSelect = (optId) => {
    if (submitted) return
    setAnswers(p => ({ ...p, [q.id]: optId }))
  }

  const handleSubmit = () => {
    setSubmitted(true)
    setChatOpen(true)
  }

  if (submitted) {
    const correct = MOCK_QUESTIONS.filter(q => answers[q.id] === q.correct).length
    const pct     = Math.round((correct / total) * 100)
    return (
      <div className="max-w-lg mx-auto px-6 py-16 text-center animate-slide-up">
        <div className={cn('w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6',
          pct >= 70 ? 'bg-green-100' : 'bg-red-100')}>
          {pct >= 70
            ? <CheckCircle size={48} className="text-green-500" />
            : <XCircle    size={48} className="text-red-500"   />}
        </div>
        <h1 className="text-3xl font-bold font-display text-dark-900 mb-2">
          {pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good Job!' : 'Keep Practicing!'}
        </h1>
        <p className="text-5xl font-bold text-brand-500 font-display my-4">{pct}%</p>
        <p className="text-dark-600">{correct} correct out of {total} questions</p>
        <div className="flex gap-3 justify-center mt-8">
          <Button variant="secondary" onClick={() => navigate(-1)}>← Back to Unit</Button>
          <Button onClick={() => { setSubmitted(false); setCurrent(0); setAnswers({}) }}>Retry Quiz</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-dark-600 hover:text-dark-900 transition-colors">
          <ChevronLeft size={16} /> Exit Quiz
        </button>
        <span className="text-sm font-medium text-dark-700">{current + 1} / {total}</span>
      </div>

      <div className="h-1.5 bg-cream-200 rounded-full mb-8 overflow-hidden">
        <div className="h-full bg-brand-500 rounded-full transition-all duration-500" style={{ width:`${progress}%` }} />
      </div>

      <div className="bg-white rounded-3xl border border-cream-200 shadow-card p-7 mb-6">
        <p className="text-xs font-semibold text-brand-500 uppercase tracking-wide mb-3">Question {current + 1}</p>
        <h2 className="text-xl font-semibold text-dark-900 font-display leading-snug">{q.text}</h2>
      </div>

      <div className="space-y-3 mb-8">
        {q.options.map((opt, i) => {
          const selected = answers[q.id] === opt.id
          return (
            <button key={opt.id} onClick={() => handleSelect(opt.id)}
              className={cn(
                'w-full flex items-center gap-3 px-5 py-4 rounded-2xl border-2 text-left transition-all font-medium text-sm',
                selected
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-cream-200 bg-white text-dark-800 hover:border-brand-300 hover:bg-cream-50',
              )}>
              <span className={cn(
                'w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center text-xs font-bold',
                selected ? 'border-brand-500 bg-brand-500 text-white' : 'border-cream-300',
              )}>
                {selected ? '✓' : String.fromCharCode(65 + i)}
              </span>
              {opt.text}
            </button>
          )
        })}
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => setCurrent(c => Math.max(0, c-1))} disabled={current===0}>
          <ChevronLeft size={16} /> Previous
        </Button>
        {current < total - 1 ? (
          <Button className="flex-1" onClick={() => setCurrent(c => c+1)} disabled={!answers[q.id]}>
            Next <ChevronRight size={16} />
          </Button>
        ) : (
          <Button className="flex-1" variant="brand"
            disabled={Object.keys(answers).length < total} onClick={handleSubmit}>
            Submit Quiz 🎯
          </Button>
        )}
      </div>
    </div>
  )
}
