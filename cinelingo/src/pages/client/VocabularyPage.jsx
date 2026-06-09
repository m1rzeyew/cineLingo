import { useState } from 'react'
import { Search, BookMarked, Trash2 } from 'lucide-react'
import Input  from '../../components/ui/Input'
import Badge  from '../../components/ui/Badge'
import { cn } from '../../utils/helpers'

const MOCK_WORDS = [
  { id:'1', english:'eloquent',     phonetic:'/ˈel.ə.kwənt/', translation:'nitiqli, ifadəli',     partOfSpeech:'adj', exampleSentence:'She gave an eloquent speech at the conference.' },
  { id:'2', english:'articulate',   phonetic:'/ɑːˈtɪk.jʊ.lət/', translation:'aydın danışmaq',   partOfSpeech:'verb', exampleSentence:'He could articulate his ideas very clearly.' },
  { id:'3', english:'metropolitan', phonetic:'/ˌmet.rəˈpɒl.ɪ.tən/', translation:'böyük şəhər', partOfSpeech:'adj',  exampleSentence:'London is a metropolitan city.' },
  { id:'4', english:'commute',      phonetic:'/kəˈmjuːt/', translation:'işə getmək',             partOfSpeech:'verb', exampleSentence:'She commutes to work by train every day.' },
  { id:'5', english:'subtle',       phonetic:'/ˈsʌt.əl/', translation:'incə, nəzərə çarpmayan',  partOfSpeech:'adj',  exampleSentence:'There was a subtle difference between the two paintings.' },
  { id:'6', english:'candid',       phonetic:'/ˈkæn.dɪd/', translation:'açıq, dürüst',           partOfSpeech:'adj',  exampleSentence:'Please be candid with me about your feelings.' },
]

export default function VocabularyPage() {
  const [search, setSearch] = useState('')
  const [words, setWords]   = useState(MOCK_WORDS)

  const filtered = words.filter(w =>
    search==='' ||
    w.english.toLowerCase().includes(search.toLowerCase()) ||
    w.translation.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-screen-lg mx-auto px-6 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-dark-900 flex items-center gap-2">
            <BookMarked size={22} className="text-brand-500" /> My Vocabulary
          </h1>
          <p className="text-dark-600 text-sm mt-0.5">{filtered.length} words saved</p>
        </div>
        <div className="w-56">
          <Input placeholder="Search words…" prefix={<Search size={14} />}
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((word) => (
          <div key={word.id}
            className="group bg-white rounded-2xl border border-cream-200 p-5 hover:shadow-card-hover transition-all">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="font-semibold text-dark-900">{word.english}</p>
                {word.phonetic && <p className="text-xs text-brand-500 font-mono mt-0.5">{word.phonetic}</p>}
              </div>
              <button onClick={() => setWords(w => w.filter(x => x.id !== word.id))}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-all">
                <Trash2 size={13} />
              </button>
            </div>
            <p className="text-sm text-dark-700 mb-2">{word.translation}</p>
            {word.exampleSentence && (
              <p className="text-xs text-dark-500 italic leading-relaxed border-l-2 border-cream-200 pl-2">
                {word.exampleSentence}
              </p>
            )}
            <div className="flex items-center gap-2 mt-3">
              {word.partOfSpeech && <Badge>{word.partOfSpeech}</Badge>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
