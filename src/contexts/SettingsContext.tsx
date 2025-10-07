import React, { createContext, useContext, useState } from 'react'

interface SettingsContextType {
  slippage: number
  setSlippage: (slippage: number) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [slippage, setSlippage] = useState(() => {
    const stored = localStorage.getItem('slippage')
    return stored ? parseFloat(stored) : 0.5
  })

  const handleSetSlippage = (newSlippage: number) => {
    setSlippage(newSlippage)
    localStorage.setItem('slippage', newSlippage.toString())
  }

  return (
    <SettingsContext.Provider value={{ slippage, setSlippage: handleSetSlippage }}>
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