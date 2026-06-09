import { useNavigate } from 'react-router-dom'
import { RotateCcw, Trophy } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { scoreColor } from '../../utils/helpers'

const MOCK_HISTORY = [
  { id:'1', quizId:'1', unitTitle:'The Art of Conversation',   score:85, correctAnswers:17, totalQuestions:20, takenAt:'2024-03-10' },
  { id:'2', quizId:'2', unitTitle:'City Life & Urban Stories', score:60, correctAnswers:12, totalQuestions:20, takenAt:'2024-03-08' },
  { id:'3', quizId:'1', unitTitle:'Basics of Grammar',         score:95, correctAnswers:19, totalQuestions:20, takenAt:'2024-03-05' },
  { id:'4', quizId:'1', unitTitle:'Music & Emotions',          score:40, correctAnswers:8,  totalQuestions:20, takenAt:'2024-03-01' },
]

export default function QuizHistoryPage() {
  const navigate = useNavigate()
  return (
    <div className="max-w-screen-lg mx-auto px-6 py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-dark-900 flex items-center gap-2">
          <Trophy size={22} className="text-brand-500" /> Quiz History
        </h1>
        <p className="text-dark-600 text-sm mt-0.5">{MOCK_HISTORY.length} quiz attempts</p>
      </div>
      <div className="space-y-3">
        {MOCK_HISTORY.map((q) => (
          <div key={q.id} className="flex items-center gap-4 bg-white rounded-2xl border border-cream-200 px-5 py-4 hover:shadow-card-hover transition-all">
            <div className={`text-2xl font-bold font-display shrink-0 w-14 text-center ${scoreColor(q.score)}`}>{q.score}%</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-dark-900">{q.unitTitle}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-dark-600">{q.correctAnswers}/{q.totalQuestions} correct</span>
                <Badge variant={q.score>=80?'success':q.score>=50?'warning':'danger'}>
                  {q.score>=80?'Excellent':q.score>=50?'Good':'Needs Work'}
                </Badge>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-dark-500">{q.takenAt}</p>
              <Button size="xs" variant="ghost" onClick={() => navigate(`/quiz/${q.quizId}`)} className="mt-1.5">
                <RotateCcw size={12} /> Retry
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
