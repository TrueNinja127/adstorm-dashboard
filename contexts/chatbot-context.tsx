"use client"

import React, { createContext, useContext, useState, useCallback } from "react"

interface ChatbotContextValue {
  isOpen: boolean
  openChatbot: () => void
  closeChatbot: () => void
  toggleChatbot: () => void
}

const ChatbotContext = createContext<ChatbotContextValue | null>(null)

export function ChatbotProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const openChatbot = useCallback(() => setIsOpen(true), [])
  const closeChatbot = useCallback(() => setIsOpen(false), [])
  const toggleChatbot = useCallback(() => setIsOpen((prev) => !prev), [])

  const value: ChatbotContextValue = {
    isOpen,
    openChatbot,
    closeChatbot,
    toggleChatbot,
  }

  return (
    <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>
  )
}

export function useChatbot() {
  const context = useContext(ChatbotContext)
  if (!context) {
    return {
      isOpen: false,
      openChatbot: () => {},
      closeChatbot: () => {},
      toggleChatbot: () => {},
    }
  }
  return context
}
