import '@rainbow-me/rainbowkit/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { config } from '@/config/wagmi'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { SettingsProvider } from '@/contexts/SettingsContext'
import { Header } from '@/components/Header'
import { SwapPage } from '@/pages/SwapPage'
import { PoolPage } from '@/pages/PoolPage'

const queryClient = new QueryClient()

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <Router>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                  <Header />
                  <Routes>
                    <Route path="/" element={<SwapPage />} />
                    <Route path="/pool" element={<PoolPage />} />
                  </Routes>
                </div>
              </Router>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </SettingsProvider>
    </ThemeProvider>
  )
}

export default App