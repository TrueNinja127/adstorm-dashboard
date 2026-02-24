"use client"

import React, { createContext, useContext, useState, useCallback } from "react"

interface CreateCampaignContextValue {
  isOpen: boolean
  openCreateCampaign: () => void
  closeCreateCampaign: () => void
}

const CreateCampaignContext = createContext<CreateCampaignContextValue | null>(null)

export function CreateCampaignProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const openCreateCampaign = useCallback(() => setIsOpen(true), [])
  const closeCreateCampaign = useCallback(() => setIsOpen(false), [])

  const value: CreateCampaignContextValue = {
    isOpen,
    openCreateCampaign,
    closeCreateCampaign,
  }

  return (
    <CreateCampaignContext.Provider value={value}>
      {children}
    </CreateCampaignContext.Provider>
  )
}

export function useCreateCampaign() {
  const context = useContext(CreateCampaignContext)
  if (!context) {
    return {
      isOpen: false,
      openCreateCampaign: () => {},
      closeCreateCampaign: () => {},
    }
  }
  return context
}
