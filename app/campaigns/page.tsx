"use client"

import { Sidebar, Header, Chatbot } from "@/components/layout"
import { CampaignsContent } from "@/components/features/campaigns"

export default function CampaignsPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header />
        <div className="flex-1 min-h-0 overflow-y-auto">
          <CampaignsContent
            showHeaderAndFeatured={true}
            scrollContainer={false}
          />
        </div>
      </div>
      <Chatbot />
    </div>
  )
}
