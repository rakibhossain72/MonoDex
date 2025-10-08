import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { ArrowDown, ChevronDown, Settings } from 'lucide-react'
import { Token, COMMON_TOKENS } from '@/types/token'
import { useDexContract } from '@/hooks/useDexContract'
import { useSettings } from '@/contexts/SettingsContext'
import { useTokenAllowance } from '@/hooks/useTokenAllowance'
import { TokenSelectModal } from '@/components/modals/TokenSelectModal'
import { TransactionModal } from '@/components/modals/TransactionModal'
import { SettingsModal } from '@/components/modals/SettingsModal'
import { ApprovalModal } from '@/components/modals/ApprovalModal'
import { formatEther } from 'viem'

export function SwapPage() {
  const { isConnected } = useAccount()
  const { swapTokens, isPending, isConfirming, error, hash } = useDexContract()
  const { slippage } = useSettings()
  
  const [tokenIn, setTokenIn] = useState<Token>(COMMON_TOKENS[0])
  const [tokenOut, setTokenOut] = useState<Token>(COMMON_TOKENS[1])
  const [amountIn, setAmountIn] = useState('')
  const [amountOut, setAmountOut] = useState('')
  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false)
  const [selectingToken, setSelectingToken] = useState<'in' | 'out'>('in')
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false)
  const [pendingApprovalToken, setPendingApprovalToken] = useState<Token | null>(null)

  // Token allowance hooks
  const tokenInAllowance = useTokenAllowance(tokenIn.address)
  const tokenOutAllowance = useTokenAllowance(tokenOut.address)

  const handleTokenSelect = (token: Token) => {
    if (selectingToken === 'in') {
      setTokenIn(token)
    } else {
      setTokenOut(token)
    }
    setIsTokenSelectOpen(false)
  }

  const getTransactionStatus = () => {
    if (isPending) return 'pending'
    if (isConfirming) return 'pending'
    if (error) return 'error'
    if (hash) return 'success'
    return null
  }

  const openTokenSelect = (type: 'in' | 'out') => {
    setSelectingToken(type)
    setIsTokenSelectOpen(true)
  }

  const switchTokens = () => {
    setTokenIn(tokenOut)
    setTokenOut(tokenIn)
    setAmountIn(amountOut)
    setAmountOut(amountIn)
  }

  const handleAmountInChange = (value: string) => {
    setAmountIn(value)
    
    // Calculate estimated output using contract
    if (value && tokenIn && tokenOut) {
      // For demo purposes, we'll use a simple calculation
      // In production, you'd want to fetch actual reserves and calculate
      const amount = parseFloat(value)
      if (!isNaN(amount)) {
        // Apply 0.3% fee simulation
        const output = amount * 0.997
        setAmountOut(output.toFixed(6))
      }
    } else {
      setAmountOut('')
    }
  }

  const handleSwap = async () => {
    if (!amountIn || !tokenIn || !tokenOut) return

    // Check if tokenIn needs approval (skip for ETH)
    if (tokenIn.address !== '0x0000000000000000000000000000000000000000') {
      if (!tokenInAllowance.hasAllowance(amountIn)) {
        setPendingApprovalToken(tokenIn)
        setIsApprovalModalOpen(true)
        return
      }
    }

    // Calculate minimum amount out based on slippage
    const minAmountOut = (parseFloat(amountOut) * (100 - slippage) / 100).toString()

    try {
      swapTokens(tokenIn.address, tokenOut.address, amountIn, minAmountOut)
      setIsTransactionModalOpen(true)
    } catch (err) {
      console.error('Swap failed:', err)
    }
  }

  const handleApproval = () => {
    if (pendingApprovalToken) {
      if (pendingApprovalToken.address === tokenIn.address) {
        tokenInAllowance.approveToken()
      }
    }
  }

  // Handle approval completion
  React.useEffect(() => {
    if (tokenInAllowance.isConfirmed && pendingApprovalToken) {
      setIsApprovalModalOpen(false)
      setPendingApprovalToken(null)
      tokenInAllowance.refetchAllowance()
      // Auto-proceed with swap after approval
      setTimeout(() => {
        handleSwap()
      }, 1000)
    }
  }, [tokenInAllowance.isConfirmed])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Swap</h2>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="space-y-1">
            {/* Token In */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">You pay</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Balance: {formatEther(tokenInAllowance.balance ?? 0n) || 0.00}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="0.0"
                  value={amountIn}
                  onChange={(e) => handleAmountInChange(e.target.value)}
                  className="flex-1 min-w-0 text-2xl font-medium bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
                />
                <button
                  onClick={() => openTokenSelect('in')}
                  className="flex items-center space-x-2 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 transition-colors flex-shrink-0"
                >
                  <div className="w-6 h-6 bg-gray-200 dark:bg-gray-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      {tokenIn.symbol.charAt(0)}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">{tokenIn.symbol}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center -my-2 relative z-10">
              <button
                onClick={switchTokens}
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-4 border-gray-50 dark:border-gray-900 rounded-xl p-2 transition-colors"
              >
                <ArrowDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Token Out */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">You receive</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Balance: {formatEther(tokenOutAllowance.balance ?? 0n) || 0.00}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="0.0"
                  value={amountOut}
                  readOnly
                  className="flex-1 min-w-0 text-2xl font-medium bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
                />
                <button
                  onClick={() => openTokenSelect('out')}
                  className="flex items-center space-x-2 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 transition-colors flex-shrink-0"
                >
                  <div className="w-6 h-6 bg-gray-200 dark:bg-gray-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      {tokenOut.symbol.charAt(0)}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">{tokenOut.symbol}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {amountIn && amountOut && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Rate</span>
                <span className="text-gray-900 dark:text-gray-100">
                  1 {tokenIn.symbol} = {(parseFloat(amountOut) / parseFloat(amountIn)).toFixed(6)} {tokenOut.symbol}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500 dark:text-gray-400">Slippage Tolerance</span>
                <span className="text-gray-900 dark:text-gray-100">{slippage}%</span>
              </div>
            </div>
          )}

          <button
            onClick={handleSwap}
            disabled={!isConnected || !amountIn || isPending || isConfirming}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-2xl transition-colors"
          >
            {!isConnected
              ? 'Connect Wallet'
              : isPending
                ? 'Confirming...'
                : isConfirming
                  ? 'Processing...'
                  : 'Swap'
            }
          </button>
        </div>
      </div>

      <TokenSelectModal
        isOpen={isTokenSelectOpen}
        onClose={() => setIsTokenSelectOpen(false)}
        onSelectToken={handleTokenSelect}
        selectedToken={selectingToken === 'in' ? tokenIn : tokenOut}
      />

      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        status={getTransactionStatus()}
        hash={hash}
        error={error?.message}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <ApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => {
          setIsApprovalModalOpen(false)
          setPendingApprovalToken(null)
        }}
        onApprove={handleApproval}
        token={pendingApprovalToken || tokenIn}
        isPending={tokenInAllowance.isPending}
        isConfirming={tokenInAllowance.isConfirming}
        error={tokenInAllowance.error?.message}
      />
    </div>
  )
}