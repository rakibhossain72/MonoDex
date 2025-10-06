import React, { createContext, useContext, useState } from 'react'

interface SettingsContextType {
  slippage: number
  setSlippage: (slippage: number) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [slippage, setSlippage] = useState(0.5) // Default 0.5%

  return (
    <SettingsContext.Provider value={{ slippage, setSlippage }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}