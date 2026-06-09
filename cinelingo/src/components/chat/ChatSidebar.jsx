import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Wifi, WifiOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../ui/Avatar'
import { cn, formatRelative } from '../../utils/helpers'

const MOCK_MESSAGES = [
  { id:'1', userId:'2', userName:'Kamran A.', content:'Did you catch that idiom? 😄', sentAt: new Date(Date.now()-300000).toISOString() },
  { id:'2', userId:'1', userName:'Alex Johnson', content:'Yes! "Beat around the bush" 🎯', sentAt: new Date(Date.now()-240000).toISOString() },
  { id:'3', userId:'3', userName:'Nigar H.', content:'The vocabulary in this unit is so useful', sentAt: new Date(Date.now()-120000).toISOString() },
  { id:'4', userId:'1', userName:'Alex Johnson', content:'Agreed, I saved 4 new words already', sentAt: new Date(Date.now()-60000).toISOString() },
]

export default function ChatSidebar({ roomId, isOpen, onToggle }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const handleSend = () => {
    const text = input.trim()
    if (!text) return
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        userId: user?.id ?? '1',
        userName: `${user?.firstName} ${user?.lastName}`,
        content: text,
        sentAt: new Date().toISOString(),
      },
    ])
    setInput('')
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* ── Kiçik trigger düyməsi — aşağı sağ künc ── */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl
                     bg-dark-900 text-white shadow-dark
                     hover:bg-dark-800 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <MessageCircle size={18} className="text-brand-400" />
          <span className="text-sm font-medium">Chat</span>
          <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
        </button>
      )}

      {/* ── Böyük sağ panel — sürüşərək açılır ── */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-80 z-40 flex flex-col',
          'bg-white border-l border-cream-200 shadow-2xl',
          'transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 bg-dark-900 shrink-0">
          <div className="flex items-center gap-2">
            <MessageCircle size={16} className="text-brand-400" />
            <span className="text-sm font-semibold text-white">Study Chat</span>
            <div className="flex items-center gap-1">
              <Wifi size={11} className="text-green-400" />
              <span className="text-[10px] text-green-400">live</span>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto chat-scroll px-4 py-4 space-y-3">
          {messages.map((msg) => {
            const isMe = msg.userId === (user?.id ?? '1')
            return (
              <div key={msg.id} className={cn('flex gap-2', isMe && 'flex-row-reverse')}>
                <Avatar name={msg.userName} size="sm" />
                <div className={cn('max-w-[75%]', isMe && 'items-end flex flex-col')}>
                  {!isMe && (
                    <span className="text-xs font-medium text-dark-500 mb-0.5 ml-1">
                      {msg.userName}
                    </span>
                  )}
                  <div
                    className={cn(
                      'px-3 py-2 rounded-2xl text-sm leading-relaxed',
                      isMe
                        ? 'bg-dark-900 text-white rounded-tr-sm'
                        : 'bg-cream-100 text-dark-900 rounded-tl-sm',
                    )}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-dark-400/60 mt-0.5 mx-1">
                    {formatRelative(msg.sentAt)}
                  </span>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-cream-200 shrink-0">
          <div className="flex items-end gap-2 bg-cream-100 rounded-2xl px-3 py-2">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Message your friends…"
              rows={1}
              className="flex-1 bg-transparent text-sm text-dark-900 placeholder:text-dark-400/60
                         resize-none focus:outline-none"
              style={{ lineHeight: '1.5', maxHeight: '80px' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={cn(
                'p-2 rounded-xl transition-all shrink-0',
                input.trim()
                  ? 'bg-dark-900 text-white hover:bg-dark-800'
                  : 'text-dark-300 cursor-not-allowed',
              )}
            >
              <Send size={15} />
            </button>
          </div>
          <p className="text-[10px] text-center text-dark-400/40 mt-1.5">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* Overlay — panel açıq olanda arxasına basanda bağlanır */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-dark-900/20 z-30"
          onClick={onToggle}
        />
      )}
    </>
  )
}