import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Link, useLocation } from 'react-router-dom'

export function Header() {
  const location = useLocation()

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
        <div className="flex items-center space-x-8">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Uniswap</h1>
            </div>
            <p className="text-red-500 text-xs mt-1">⚠️ Testnet Only</p>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                location.pathname === '/'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Swap
            </Link>
            <Link
              to="/pool"
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                location.pathname === '/pool'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Pool
            </Link>
          </nav>
        </div>

        <ConnectButton />
      </div>
    </header>
  )
}