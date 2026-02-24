"use client"

import { Sidebar, Header, Chatbot } from "@/components/layout"
import { HeroCarousel } from "@/components/carousel/hero-carousel"
import { BrandsContent } from "@/components/features/brands"

export default function BrandsPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header />
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="relative h-[70vh] min-h-[420px] w-full shrink-0">
            <HeroCarousel embedded />
          </div>
          <BrandsContent
            showHeaderAndFeatured={false}
            scrollContainer={false}
          />
        </div>
      </div>
      <Chatbot />
    </div>
  )
}
