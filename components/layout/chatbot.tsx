"use client"

import { useState } from "react"
import { MessageCircle, X, Send, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useChatbot } from "@/contexts/chatbot-context"

export function Chatbot() {
  const { isOpen, closeChatbot, toggleChatbot } = useChatbot()
  const [message, setMessage] = useState("")

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-20 right-5 z-50 flex h-[380px] w-[320px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl animate-scale-in origin-bottom-right">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-foreground">
                  AI Assistant
                </p>
                <p className="text-[10px] text-emerald-400">Online</p>
              </div>
            </div>
            <button
              onClick={closeChatbot}
              className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            <div className="flex gap-2">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-primary/10">
                <Sparkles className="h-3 w-3 text-primary" />
              </div>
              <div className="rounded-lg rounded-tl-sm bg-secondary px-3 py-2">
                <p className="text-[12px] leading-relaxed text-foreground">
                  {
                    "Hello! I'm your ADStorm assistant. I can help with campaigns, targeting, and performance insights."
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 bg-transparent text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button className="btn-gelatine flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90">
                <Send className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={toggleChatbot}
        className={cn(
          "btn-gelatine fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-all duration-200",
          isOpen
            ? "bg-secondary text-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        {isOpen ? (
          <X className="h-4 w-4" />
        ) : (
          <MessageCircle className="h-4 w-4" />
        )}
      </button>
    </>
  )
}
