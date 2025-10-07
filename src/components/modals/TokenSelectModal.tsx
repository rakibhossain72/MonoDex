import { useState } from 'react'
import { X, Search, Plus } from 'lucide-react'
import { Token, COMMON_TOKENS } from '@/types/token'

interface TokenSelectModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectToken: (token: Token) => void
  selectedToken?: Token
}

export function TokenSelectModal({ isOpen, onClose, onSelectToken, selectedToken }: TokenSelectModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddToken, setShowAddToken] = useState(false)
  const [customTokenAddress, setCustomTokenAddress] = useState('')
  const [customTokenSymbol, setCustomTokenSymbol] = useState('')
  const [customTokenName, setCustomTokenName] = useState('')
  const [customTokenDecimals, setCustomTokenDecimals] = useState('')

  const filteredTokens = COMMON_TOKENS.filter(token =>
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddCustomToken = () => {
    if (!customTokenAddress || !customTokenSymbol || !customTokenName || !customTokenDecimals) return
    
    const customToken: Token = {
      address: customTokenAddress,
      symbol: customTokenSymbol,
      name: customTokenName,
      decimals: parseInt(customTokenDecimals)
    }
    
    onSelectToken(customToken)
    onClose()
    
    // Reset form
    setCustomTokenAddress('')
    setCustomTokenSymbol('')
    setCustomTokenName('')
    setCustomTokenDecimals('')
    setShowAddToken(false)
  }

  const resetAndClose = () => {
    setShowAddToken(false)
    setSearchQuery('')
    setCustomTokenAddress('')
    setCustomTokenSymbol('')
    setCustomTokenName('')
    setCustomTokenDecimals('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Select a token</h2>
          <button
            onClick={resetAndClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {!showAddToken ? (
          <>
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search name or paste address"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="px-4 pb-2">
              <button
                onClick={() => setShowAddToken(true)}
                className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-pink-500 dark:hover:border-pink-500 transition-colors"
              >
                <Plus className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400 font-medium">Add Custom Token</span>
              </button>
            </div>

            <div className="overflow-y-auto max-h-96">
              {filteredTokens.map((token) => (
                <button
                  key={token.address}
                  onClick={() => {
                    onSelectToken(token)
                    resetAndClose()
                  }}
                  disabled={selectedToken?.address === token.address}
                  className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {token.symbol.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{token.symbol}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{token.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Add Custom Token</h3>
              <button
                onClick={() => setShowAddToken(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Back
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Token Contract Address
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={customTokenAddress}
                  onChange={(e) => setCustomTokenAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Token Symbol
                </label>
                <input
                  type="text"
                  placeholder="e.g. USDC"
                  value={customTokenSymbol}
                  onChange={(e) => setCustomTokenSymbol(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Token Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. USD Coin"
                  value={customTokenName}
                  onChange={(e) => setCustomTokenName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Decimals
                </label>
                <input
                  type="number"
                  placeholder="18"
                  value={customTokenDecimals}
                  onChange={(e) => setCustomTokenDecimals(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
            
            <button
              onClick={handleAddCustomToken}
              disabled={!customTokenAddress || !customTokenSymbol || !customTokenName || !customTokenDecimals}
              className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors"
            >
              Add Token
            </button>
          </div>
        )}
      </div>
    </div>
  )
}