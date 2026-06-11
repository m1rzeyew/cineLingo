import { useState, useEffect, useRef, useCallback } from 'react'
import * as signalR from '@microsoft/signalr'

const HUB_URL = import.meta.env.VITE_SIGNALR_HUB_URL || 'http://localhost:5267/hubs/chat'

export function useChat() {
  const [messages, setMessages] = useState([])
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const connectionRef = useRef(null)

  const connect = useCallback(async () => {
    if (connectionRef.current) return
    setConnecting(true)
    const token = localStorage.getItem('cinelingo_token')

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build()

    connection.on('ReceiveMessage', (msg) => {
      setMessages((prev) => [...prev, {
        id: msg.id ?? `${msg.senderId}-${msg.sentAt ?? Date.now()}`,
        senderId: msg.senderId,
        content: msg.message ?? msg.content,
        createdAt: msg.sentAt ?? msg.createdAt ?? new Date().toISOString(),
      }])
    })

    connection.onreconnecting(() => setConnected(false))
    connection.onreconnected(() => setConnected(true))
    connection.onclose(() => setConnected(false))

    try {
      await connection.start()
      connectionRef.current = connection
      setConnected(true)
    } catch (err) {
      console.warn('Chat connection failed:', err)
    } finally {
      setConnecting(false)
    }
  }, [])

  const disconnect = useCallback(async () => {
    if (connectionRef.current) {
      try { await connectionRef.current.stop() } catch {}
      connectionRef.current = null
      setConnected(false)
      setMessages([])
    }
  }, [])

  const sendMessage = useCallback(async (receiverId, content) => {
    if (!connectionRef.current || !connected || !receiverId || !content?.trim()) return false
    try {
      await connectionRef.current.invoke('SendMessage', receiverId, content.trim())
      return true
    } catch (err) {
      console.warn('Send failed:', err)
      return false
    }
  }, [connected])

  useEffect(() => {
    connect()
    return () => { disconnect() }
  }, [connect, disconnect])

  return { messages, connected, connecting, sendMessage }
}
