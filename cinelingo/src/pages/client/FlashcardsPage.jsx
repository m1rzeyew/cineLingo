import { useState } from 'react'
import { ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react'
import Button from '../../components/ui/Button'

const MOCK_CARDS = [
  { id:'1', english:'eloquent',     phonetic:'/ˈel.ə.kwənt/',     translation:'nitiqli, ifadəli',         exampleSentence:'She gave an eloquent speech.',              partOfSpeech:'adj'  },
  { id:'2', english:'articulate',   phonetic:'/ɑːˈtɪk.jʊ.lət/',   translation:'aydın danışmaq',           exampleSentence:'He articulated his ideas clearly.',          partOfSpeech:'verb' },
  { id:'3', english:'subtle',       phonetic:'/ˈsʌt.əl/',          translation:'incə, nəzərə çarpmayan',   exampleSentence:'There was a subtle difference.',             partOfSpeech:'adj'  },
  { id:'4', english:'metropolitan', phonetic:'/ˌmet.rəˈpɒl.ɪ.tən/', translation:'böyük şəhər',           exampleSentence:'London is a metropolitan city.',             partOfSpeech:'adj'  },
  { id:'5', english:'candid',       phonetic:'/ˈkæn.dɪd/',         translation:'açıq, dürüst',             exampleSentence:'Please be candid with your opinion.',        partOfSpeech:'adj'  },
]

export default function FlashcardsPage() {
  const [index,   setIndex]   = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done,    setDone]    = useState([])

  const card  = MOCK_CARDS[index]
  const total = MOCK_CARDS.length

  const next = () => {
    setFlipped(false)
    setDone(p => [...p, index])
    setTimeout(() => { if (index < total - 1) setIndex(i => i + 1) }, 200)
  }

  const restart = () => { setIndex(0); setFlipped(false); setDone([]) }
  const isDone  = index >= total - 1 && done.includes(index)

  if (isDone) {
    return (
      <div className="max-w-lg mx-auto px-6 py-16 text-center animate-slide-up">
        <p className="text-6xl mb-4">🎉</p>
        <h2 className="text-2xl font-bold font-display text-dark-900 mb-2">Session Complete!</h2>
        <p className="text-dark-600 mb-8">You reviewed {total} flashcards</p>
        <Button size="lg" onClick={restart}><RotateCcw size={16} /> Restart Session</Button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold font-display text-dark-900">Flashcards</h1>
        <span className="text-sm text-dark-600 font-medium">{index + 1} / {total}</span>
      </div>

      <div className="h-1.5 bg-cream-200 rounded-full mb-8 overflow-hidden">
        <div className="h-full bg-brand-500 rounded-full transition-all duration-500"
          style={{ width:`${((index+1)/total)*100}%` }} />
      </div>

      <div className="card-3d mb-6">
        <div className={`card-inner ${flipped ? 'flipped' : ''}`} style={{ height:'260px' }}>
          <div onClick={() => setFlipped(true)}
            className="card-front absolute inset-0 bg-white rounded-3xl border-2 border-cream-200 shadow-card
                       flex flex-col items-center justify-center cursor-pointer p-8 text-center">
            <p className="text-xs font-semibold text-brand-500 uppercase tracking-widest mb-4">
              {card?.partOfSpeech ?? 'Word'}
            </p>
            <h2 className="text-3xl font-bold font-display text-dark-900 mb-2">{card?.english}</h2>
            <p className="text-base text-brand-500 font-mono">{card?.phonetic}</p>
            <p className="text-xs text-dark-500 mt-6">Tap to reveal answer</p>
          </div>
          <div onClick={() => setFlipped(false)}
            className="card-back absolute inset-0 bg-dark-900 rounded-3xl border-2 border-dark-800 shadow-card
                       flex flex-col items-center justify-center p-8 text-center">
            <p className="text-xs font-semibold text-brand-400 uppercase tracking-widest mb-4">Translation</p>
            <h2 className="text-2xl font-bold font-display text-white mb-3">{card?.translation}</h2>
            {card?.exampleSentence && (
              <p className="text-sm text-white/60 italic leading-relaxed max-w-xs">"{card.exampleSentence}"</p>
            )}
          </div>
        </div>
      </div>

      {flipped ? (
        <div className="flex gap-3">
          <Button variant="secondary" size="lg" className="flex-1 border-red-200 text-red-600 hover:bg-red-50" onClick={next}>
            <ThumbsDown size={17} /> Again
          </Button>
          <Button variant="brand" size="lg" className="flex-1" onClick={next}>
            <ThumbsUp size={17} /> Got it!
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => { setFlipped(false); setIndex(i => Math.max(0,i-1)) }} disabled={index===0}>
            <ChevronLeft size={16} /> Previous
          </Button>
          <Button onClick={() => setFlipped(true)}>Flip Card</Button>
          <Button variant="ghost" onClick={next}>Skip <ChevronRight size={16} /></Button>
        </div>
      )}
    </div>
  )
}