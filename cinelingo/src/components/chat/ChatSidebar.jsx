import { useEffect, useMemo, useRef, useState } from 'react'
import { MessageCircle, Send, Wifi, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { chatService } from '../../services'
import { useChat } from '../../hooks/useChat'
import Avatar from '../ui/Avatar'
import { cn, formatRelative, getApiErrorMessage } from '../../utils/helpers'
import { useLanguage } from '../../context/LanguageContext'

const list = (value) => Array.isArray(value) ? value : []

const normalizeConversation = (conversation) => ({
  id: conversation.id,
  otherUserId: conversation.otherUserId,
  otherUserName: conversation.otherUserName || 'Learner',
  otherUserAvatar: conversation.otherUserAvatar,
  lastMessage: conversation.lastMessage,
  lastMessageAt: conversation.lastMessageAt,
})

const normalizeMessage = (message) => ({
  id: message.id,
  senderId: message.senderId,
  senderName: message.senderName,
  content: message.content,
  createdAt: message.createdAt,
  isRead: message.isRead,
})

export default function ChatSidebar({ isOpen, onToggle }) {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { messages: liveMessages, connected, connecting, sendMessage } = useChat()
  const [conversations, setConversations] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const liveCountRef = useRef(0)

  const selected = useMemo(
    () => conversations.find(item => item.id === selectedId) || conversations[0] || null,
    [conversations, selectedId],
  )

  useEffect(() => {
    if (!isOpen) return
    let active = true

    const loadConversations = async () => {
      setLoading(true)
      try {
        const res = await chatService.getConversations()
        const next = list(res.data).map(normalizeConversation)
        if (!active) return
        setConversations(next)
        setSelectedId(current => current ?? next[0]?.id ?? null)
      } catch (err) {
        if (active) toast.error(getApiErrorMessage(err, t('chat.loadConversationsError', 'Could not load conversations.')))
      } finally {
        if (active) setLoading(false)
      }
    }

    loadConversations()
    return () => { active = false }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !selected?.id) {
      setMessages([])
      return
    }

    let active = true
    const loadMessages = async () => {
      setLoading(true)
      try {
        const res = await chatService.getMessages(selected.id)
        if (active) setMessages(list(res.data).map(normalizeMessage))
      } catch (err) {
        if (active) toast.error(getApiErrorMessage(err, t('chat.loadMessagesError', 'Could not load messages.')))
      } finally {
        if (active) setLoading(false)
      }
    }

    loadMessages()
    return () => { active = false }
  }, [isOpen, selected?.id])

  useEffect(() => {
    if (!selected) return
    const unreadLiveMessages = liveMessages.slice(liveCountRef.current)
    liveCountRef.current = liveMessages.length
    const next = unreadLiveMessages.filter(message =>
      message.senderId === selected.otherUserId || message.senderId === user?.id,
    )
    if (next.length) {
      setMessages(prev => [...prev, ...next.map(normalizeMessage)])
    }
  }, [liveMessages, selected, user?.id])

  useEffect(() => {
    if (isOpen) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || !selected?.otherUserId) return
    const ok = await sendMessage(selected.otherUserId, text)
    if (ok) setInput('')
    else toast.error(t('chat.sendError', 'Could not send message.'))
    // TODO: persist sent messages when the backend exposes a Swagger-supported send-message endpoint.
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={onToggle}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-brand-500 px-4 py-3 text-white shadow-amber transition-all duration-200 hover:scale-105 hover:bg-brand-600 active:scale-95"
        >
          <MessageCircle size={18} />
          <span className="text-sm font-semibold">{t('chat.label', 'Chat')}</span>
          <span className={cn('h-2 w-2 rounded-full', connected ? 'bg-brand-100' : 'bg-warning-300')} />
        </button>
      )}

      <div
        className={cn(
          'fixed right-0 top-0 z-40 flex h-full w-80 flex-col',
          'border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900',
          'transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex shrink-0 items-center justify-between bg-gradient-to-r from-brand-500 to-accent-600 px-4 py-4">
          <div className="flex items-center gap-2">
            <MessageCircle size={16} className="text-white" />
            <span className="text-sm font-semibold text-white">{t('chat.studyChat', 'Study Chat')}</span>
            <div className="flex items-center gap-1">
              <Wifi size={11} className="text-brand-100" />
              <span className="text-[10px] text-brand-100">{connecting ? t('chat.connecting', 'connecting') : connected ? t('chat.live', 'live') : t('chat.offline', 'offline')}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggle}
            className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label={t('chat.close', 'Close chat')}
          >
            <X size={16} />
          </button>
        </div>

        <div className="border-b border-slate-200 p-3 dark:border-slate-800">
          {loading && conversations.length === 0 ? (
            <p className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">{t('chat.loadingConversations', 'Loading conversations...')}</p>
          ) : conversations.length === 0 ? (
            <p className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {t('chat.noConversations', 'No conversations yet. Start one from a learner profile.')}
            </p>
          ) : (
            <div className="thin-scroll flex gap-2 overflow-x-auto">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => setSelectedId(conversation.id)}
                  className={cn(
                    'flex min-w-44 items-center gap-2 rounded-xl border px-3 py-2 text-left transition-colors',
                    selected?.id === conversation.id
                      ? 'border-brand-300 bg-brand-50 text-brand-800 dark:border-brand-500 dark:bg-brand-500/10 dark:text-brand-200'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-brand-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
                  )}
                >
                  <Avatar name={conversation.otherUserName} src={conversation.otherUserAvatar} size="sm" />
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-bold">{conversation.otherUserName}</span>
                    <span className="block truncate text-[10px] opacity-60">{conversation.lastMessage || t('chat.noMessagesYet', 'No messages yet')}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="chat-scroll flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {!selected && !loading && (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
              {t('chat.selectConversation', 'Select a conversation to view messages.')}
            </p>
          )}
          {selected && messages.length === 0 && !loading && (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
              {t('chat.noMessages', 'No messages in this conversation yet.')}
            </p>
          )}
          {messages.map((msg) => {
            const isMe = msg.senderId === user?.id
            const name = isMe ? t('you', 'You') : msg.senderName || selected?.otherUserName || t('learner', 'Learner')
            return (
              <div key={`${msg.id}-${msg.createdAt}`} className={cn('flex gap-2', isMe && 'flex-row-reverse')}>
                <Avatar name={name} size="sm" />
                <div className={cn('max-w-[75%]', isMe && 'flex flex-col items-end')}>
                  {!isMe && (
                    <span className="mb-0.5 ml-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {name}
                    </span>
                  )}
                  <div className={cn(
                    'rounded-2xl px-3 py-2 text-sm leading-relaxed',
                    isMe
                      ? 'rounded-tr-sm bg-brand-500 text-white'
                      : 'rounded-tl-sm bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100',
                  )}>
                    {msg.content}
                  </div>
                  {msg.createdAt && (
                    <span className="mx-1 mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                      {formatRelative(msg.createdAt)}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        <div className="shrink-0 border-t border-slate-200 p-3 dark:border-slate-800">
          <div className="flex items-end gap-2 rounded-2xl bg-slate-100 px-3 py-2 dark:bg-slate-800">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={selected ? t('chat.messagePlaceholder', 'Message {{name}}...').replace('{{name}}', selected.otherUserName) : t('chat.selectConversationShort', 'Select a conversation...')}
              rows={1}
              disabled={!selected}
              className="flex-1 resize-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-100 dark:placeholder:text-slate-500"
              style={{ lineHeight: '1.5', maxHeight: '80px' }}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || !selected}
              className={cn(
                'shrink-0 rounded-xl p-2 transition-all',
                input.trim() && selected
                  ? 'bg-brand-500 text-white hover:bg-brand-600'
                  : 'cursor-not-allowed text-slate-300 dark:text-slate-600',
              )}
            aria-label={t('chat.send', 'Send message')}
            >
              <Send size={15} />
            </button>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-slate-400 dark:text-slate-500">
            {t('chat.enterHint', 'Enter to send - Shift+Enter for new line')}
          </p>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/20"
          onClick={onToggle}
        />
      )}
    </>
  )
}
