import { useState, useEffect, useRef, useCallback } from 'react'
import * as signalR from '@microsoft/signalr'

const HUB_URL = import.meta.env.VITE_SIGNALR_HUB_URL || 'http://localhost:5000/hubs/chat'

export function useChat(roomId) {
  const [messages,   setMessages]   = useState([])
  const [connected,  setConnected]  = useState(false)
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
      setMessages((prev) => [...prev, msg])
    })

    connection.on('MessageHistory', (history) => {
      setMessages(history)
    })

    connection.onreconnecting(() => setConnected(false))
    connection.onreconnected(() => setConnected(true))
    connection.onclose(() => setConnected(false))

    try {
      await connection.start()
      if (roomId) await connection.invoke('JoinRoom', roomId)
      connectionRef.current = connection
      setConnected(true)
    } catch (err) {
      console.warn('Chat connection failed:', err)
    } finally {
      setConnecting(false)
    }
  }, [roomId])

  const disconnect = useCallback(async () => {
    if (connectionRef.current) {
      try { await connectionRef.current.stop() } catch { /* ignore */ }
      connectionRef.current = null
      setConnected(false)
      setMessages([])
    }
  }, [])

  const sendMessage = useCallback(async (content) => {
    if (!connectionRef.current || !connected) return
    try {
      await connectionRef.current.invoke('SendMessage', { roomId, content })
    } catch (err) {
      console.warn('Send failed:', err)
    }
  }, [connected, roomId])

  useEffect(() => {
    connect()
    return () => { disconnect() }
  }, [roomId]) // eslint-disable-line

  return { messages, connected, connecting, sendMessage }
}
