"use client"

import { useState, useCallback } from "react"
import {
  Sidebar,
  Header,
  CategoryCards,
  Chatbot,
  LoadingScreen,
} from "@/components/layout"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)

  const handleLoadComplete = useCallback(() => {
    setLoading(false)
  }, [])

  return (
    <>
      {loading && <LoadingScreen onComplete={handleLoadComplete} />}

      <div
        className={`flex h-screen overflow-hidden transition-opacity duration-500 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <CategoryCards />
        </div>

        {/* Chatbot */}
        <Chatbot />
      </div>
    </>
  )
}
