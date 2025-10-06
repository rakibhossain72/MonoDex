import { useState } from 'react'
import { X, Search } from 'lucide-react'
import { Token, COMMON_TOKENS } from '@/types/token'

interface TokenSelectModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectToken: (token: Token) => void
  selectedToken?: Token
}

export function TokenSelectModal({ isOpen, onClose, onSelectToken, selectedToken }: TokenSelectModalProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTokens = COMMON_TOKENS.filter(token =>
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Select a token</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search name or paste address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-y-auto max-h-96">
          {filteredTokens.map((token) => (
            <button
              key={token.address}
              onClick={() => {
                onSelectToken(token)
                onClose()
              }}
              disabled={selectedToken?.address === token.address}
              className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {token.symbol.charAt(0)}
                </span>
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">{token.symbol}</div>
                <div className="text-sm text-gray-500">{token.name}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}