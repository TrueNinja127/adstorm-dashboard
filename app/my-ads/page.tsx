"use client"

import { Sidebar, Header, Chatbot } from "@/components/layout"
import { MyAdsContent } from "@/components/features/ads"

export default function MyAdsPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header />
        <div className="flex-1 min-h-0 overflow-y-auto">
          <MyAdsContent showHeader scrollContainer={false} />
        </div>
      </div>
      <Chatbot />
    </div>
  )
}
