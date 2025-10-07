import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Plus, Minus } from 'lucide-react'
import { Token, COMMON_TOKENS } from '@/types/token'
import { TokenSelectModal } from '@/components/modals/TokenSelectModal'
import { TransactionModal } from '@/components/modals/TransactionModal'
import { useDexContract } from '@/hooks/useDexContract'

export function PoolPage() {
  const { isConnected } = useAccount()
  const { addLiquidity, removeLiquidity, isPending, isConfirming, error, hash, reserves } = useDexContract()
  
  const [tokenA, setTokenA] = useState<Token>(COMMON_TOKENS[0])
  const [tokenB, setTokenB] = useState<Token>(COMMON_TOKENS[1])
  const [amountA, setAmountA] = useState('')
  const [amountB, setAmountB] = useState('')
  const [liquidityAmount, setLiquidityAmount] = useState('')
  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false)
  const [selectingToken, setSelectingToken] = useState<'A' | 'B'>('A')
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'add' | 'remove'>('add')

  const handleTokenSelect = (token: Token) => {
    if (selectingToken === 'A') {
      setTokenA(token)
    } else {
      setTokenB(token)
    }
  }

  const openTokenSelect = (type: 'A' | 'B') => {
    setSelectingToken(type)
    setIsTokenSelectOpen(true)
  }

  const handleAddLiquidity = () => {
    if (!amountA || !amountB || !tokenA || !tokenB) return
    setIsTransactionModalOpen(true)
    addLiquidity(tokenA.address, tokenB.address, amountA, amountB)
  }

  const handleRemoveLiquidity = () => {
    if (!liquidityAmount || !tokenA || !tokenB) return
    setIsTransactionModalOpen(true)
    removeLiquidity(tokenA.address, tokenB.address, liquidityAmount)
  }

  const getTransactionStatus = () => {
    if (isPending) return 'pending'
    if (isConfirming) return 'pending'
    if (error) return 'error'
    if (hash) return 'success'
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Pool</h2>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setActiveTab('add')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'add'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
            <button
              onClick={() => setActiveTab('remove')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'remove'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Minus className="w-4 h-4" />
              <span>Remove</span>
            </button>
          </div>

          {activeTab === 'add' ? (
            <div className="space-y-4">
              {/* Token A Input */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Token A</span>
                  <span className="text-sm text-gray-500">Balance: 0.00</span>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    placeholder="0.0"
                    value={amountA}
                    onChange={(e) => setAmountA(e.target.value)}
                    className="flex-1 text-2xl font-medium bg-transparent border-none outline-none placeholder-gray-400"
                  />
                  <button
                    onClick={() => openTokenSelect('A')}
                    className="flex items-center space-x-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2 transition-colors"
                  >
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {tokenA.symbol.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900">{tokenA.symbol}</span>
                  </button>
                </div>
              </div>

              {/* Token B Input */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Token B</span>
                  <span className="text-sm text-gray-500">Balance: 0.00</span>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    placeholder="0.0"
                    value={amountB}
                    onChange={(e) => setAmountB(e.target.value)}
                    className="flex-1 text-2xl font-medium bg-transparent border-none outline-none placeholder-gray-400"
                  />
                  <button
                    onClick={() => openTokenSelect('B')}
                    className="flex items-center space-x-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2 transition-colors"
                  >
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {tokenB.symbol.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900">{tokenB.symbol}</span>
                  </button>
                </div>
              </div>

              {reserves && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Pool Information</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reserve A:</span>
                      <span className="text-gray-900">{parseFloat(reserves.reserveA).toFixed(4)} {tokenA.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reserve B:</span>
                      <span className="text-gray-900">{parseFloat(reserves.reserveB).toFixed(4)} {tokenB.symbol}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddLiquidity}
                disabled={!isConnected || !amountA || !amountB || isPending || isConfirming}
                className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-4 px-4 rounded-2xl transition-colors"
              >
                {!isConnected ? 'Connect Wallet' : isPending || isConfirming ? 'Adding Liquidity...' : 'Add Liquidity'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Liquidity Amount</span>
                  <span className="text-sm text-gray-500">Your Liquidity: 0.00</span>
                </div>
                <input
                  type="number"
                  placeholder="0.0"
                  value={liquidityAmount}
                  onChange={(e) => setLiquidityAmount(e.target.value)}
                  className="w-full text-2xl font-medium bg-transparent border-none outline-none placeholder-gray-400"
                />
              </div>

              <div className="text-center text-sm text-gray-500">
                Remove liquidity from {tokenA.symbol}/{tokenB.symbol} pool
              </div>

              <button
                onClick={handleRemoveLiquidity}
                disabled={!isConnected || !liquidityAmount || isPending || isConfirming}
                className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-4 px-4 rounded-2xl transition-colors"
              >
                {!isConnected ? 'Connect Wallet' : isPending || isConfirming ? 'Removing Liquidity...' : 'Remove Liquidity'}
              </button>
            </div>
          )}
        </div>
      </div>

      <TokenSelectModal
        isOpen={isTokenSelectOpen}
        onClose={() => setIsTokenSelectOpen(false)}
        onSelectToken={handleTokenSelect}
        selectedToken={selectingToken === 'A' ? tokenA : tokenB}
      />

      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        status={getTransactionStatus()}
        hash={hash}
        error={error?.message}
      />
    </div>
  )
}