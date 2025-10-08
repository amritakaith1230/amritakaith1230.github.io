"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface SystemSettings {
  shipName: string
  capacity: number
  currentLocation: string
  nextPort: string
  arrivalTime: string
}

interface SystemContextType {
  settings: SystemSettings
  updateSettings: (newSettings: Partial<SystemSettings>) => void
}

const SystemContext = createContext<SystemContextType | undefined>(undefined)

export function SystemProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SystemSettings>({
    shipName: "Maharaja Cruise Explorer",
    capacity: 2500,
    currentLocation: "Arabian Sea",
    nextPort: "Goa, India",
    arrivalTime: "Tomorrow, 8:00 AM",
  })

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("systemSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    localStorage.setItem("systemSettings", JSON.stringify(updatedSettings))
  }

  return <SystemContext.Provider value={{ settings, updateSettings }}>{children}</SystemContext.Provider>
}

export function useSystem() {
  const context = useContext(SystemContext)
  if (context === undefined) {
    throw new Error("useSystem must be used within a SystemProvider")
  }
  return context
}
