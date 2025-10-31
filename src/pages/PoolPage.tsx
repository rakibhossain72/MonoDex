import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { formatEther } from 'viem'
import { Plus, Minus, ChevronDown } from 'lucide-react'
import { Token, COMMON_TOKENS } from '@/types/token'
import { TokenSelectModal } from '@/components/modals/TokenSelectModal'
import { TransactionModal } from '@/components/modals/TransactionModal'
import { useTokenAllowance } from '@/hooks/useTokenAllowance'
import { ApprovalModal } from '@/components/modals/ApprovalModal'
import { useReserves } from '@/hooks/useReserves'
import { useDexPool } from '@/hooks/useDexPool'

export function PoolPage() {
  const { isConnected, address } = useAccount()

  // State declarations must come before hooks that depend on them
  const [tokenA, setTokenA] = useState<Token>(COMMON_TOKENS[0])
  const [tokenB, setTokenB] = useState<Token>(COMMON_TOKENS[1])

  const { addLiquidity, removeLiquidity, getPairId, liquidityBalance, isPending, isConfirming, error, hash } = useDexPool()
  console.log(tokenA.address, tokenB.address)
  const { data: reserves } = useReserves(tokenA.address, tokenB.address)

  // Token allowance hooks
  const tokenAAllowance = useTokenAllowance(tokenA.address)
  const tokenBAllowance = useTokenAllowance(tokenB.address)

  const [amountA, setAmountA] = useState('')
  const [amountB, setAmountB] = useState('')
  const [liquidityAmount, setLiquidityAmount] = useState('')
  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false)
  const [selectingToken, setSelectingToken] = useState<'A' | 'B'>('A')
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'add' | 'remove'>('add')
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false)
  const [pendingApprovalToken, setPendingApprovalToken] = useState<Token | null>(null)

  const pairId = getPairId(tokenA.address, tokenB.address).data
  const lpBalance = liquidityBalance(pairId || '0', address || '0').data
  console.log('LP Balance:', lpBalance ? formatEther(lpBalance) : '0.00')

  // Format balance with truncation
  const formatBalance = (balance: bigint | null | undefined): string => {
    if (!balance) return '0.00'
    
    const balanceStr = formatEther(balance)
    const balanceNum = parseFloat(balanceStr)
    
    if (balanceNum === 0) return '0.00'
    if (balanceNum < 0.000001) return '<0.000001'
    if (balanceNum < 1) return balanceNum.toFixed(6)
    if (balanceNum < 1000) return balanceNum.toFixed(4)
    if (balanceNum < 10000) return balanceNum.toFixed(2)
    
    // For large numbers, use compact notation
    if (balanceNum >= 1000000) {
      return (balanceNum / 1000000).toFixed(2) + 'M'
    }
    if (balanceNum >= 1000) {
      return (balanceNum / 1000).toFixed(2) + 'K'
    }
    
    return balanceNum.toFixed(2)
  }

  // Enhanced add liquidity button disable logic
  const isAddLiquidityDisabled = (): boolean => {
    if (!isConnected) return true
    if (!amountA || !amountB) return true
    if (isPending || isConfirming) return true
    
    const amountANum = parseFloat(amountA)
    const amountBNum = parseFloat(amountB)
    
    if (isNaN(amountANum) || amountANum <= 0 || isNaN(amountBNum) || amountBNum <= 0) return true
    
    // Check if user has sufficient balance for both tokens
    const userBalanceA = tokenAAllowance.balance ? parseFloat(formatEther(tokenAAllowance.balance)) : 0
    const userBalanceB = tokenBAllowance.balance ? parseFloat(formatEther(tokenBAllowance.balance)) : 0
    
    if (amountANum > userBalanceA || amountBNum > userBalanceB) return true
    
    // Check if tokens are the same
    if (tokenA.address === tokenB.address) return true
    
    return false
  }

  // Enhanced remove liquidity button disable logic
  const isRemoveLiquidityDisabled = (): boolean => {
    if (!isConnected) return true
    if (!liquidityAmount) return true
    if (isPending || isConfirming) return true
    
    const liquidityAmountNum = parseFloat(liquidityAmount)
    if (isNaN(liquidityAmountNum) || liquidityAmountNum <= 0) return true
    
    // Check if user has sufficient LP tokens
    const userLpBalance = lpBalance ? parseFloat(formatEther(lpBalance)) : 0
    if (liquidityAmountNum > userLpBalance) return true
    
    // Check if tokens are the same
    if (tokenA.address === tokenB.address) return true
    
    return false
  }

  // Get add liquidity button text
  const getAddLiquidityButtonText = (): string => {
    if (!isConnected) return 'Connect Wallet'
    if (isPending || isConfirming) return 'Adding Liquidity...'
    
    const amountANum = parseFloat(amountA)
    const amountBNum = parseFloat(amountB)
    const userBalanceA = tokenAAllowance.balance ? parseFloat(formatEther(tokenAAllowance.balance)) : 0
    const userBalanceB = tokenBAllowance.balance ? parseFloat(formatEther(tokenBAllowance.balance)) : 0
    
    if (amountANum > userBalanceA) return `Insufficient ${tokenA.symbol}`
    if (amountBNum > userBalanceB) return `Insufficient ${tokenB.symbol}`
    if (tokenA.address === tokenB.address) return 'Select Different Tokens'
    if (!amountA || !amountB) return 'Enter Amounts'
    
    return 'Add Liquidity'
  }

  // Get remove liquidity button text
  const getRemoveLiquidityButtonText = (): string => {
    if (!isConnected) return 'Connect Wallet'
    if (isPending || isConfirming) return 'Removing Liquidity...'
    
    const liquidityAmountNum = parseFloat(liquidityAmount)
    const userLpBalance = lpBalance ? parseFloat(formatEther(lpBalance)) : 0
    
    if (liquidityAmountNum > userLpBalance) return 'Insufficient Liquidity'
    if (tokenA.address === tokenB.address) return 'Select Different Tokens'
    if (!liquidityAmount) return 'Enter Amount'
    
    return 'Remove Liquidity'
  }

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

    // Check tokenA allowance (skip for ETH)
    if (tokenA.address !== '0x0000000000000000000000000000000000000000') {
      if (!tokenAAllowance.hasAllowance(amountA)) {
        setPendingApprovalToken(tokenA)
        setIsApprovalModalOpen(true)
        return
      }
    }

    // Check tokenB allowance (skip for ETH)
    if (tokenB.address !== '0x0000000000000000000000000000000000000000') {
      if (!tokenBAllowance.hasAllowance(amountB)) {
        setPendingApprovalToken(tokenB)
        setIsApprovalModalOpen(true)
        return
      }
    }

    setIsTransactionModalOpen(true)
    addLiquidity(tokenA.address, tokenB.address, amountA, amountB)
  }

  const handleApproval = () => {
    if (pendingApprovalToken) {
      if (pendingApprovalToken.address === tokenA.address) {
        tokenAAllowance.approveToken()
      } else if (pendingApprovalToken.address === tokenB.address) {
        tokenBAllowance.approveToken()
      }
    }
  }

  // Handle approval completion
  React.useEffect(() => {
    const tokenAApproved = tokenAAllowance.isConfirmed && pendingApprovalToken?.address === tokenA.address
    const tokenBApproved = tokenBAllowance.isConfirmed && pendingApprovalToken?.address === tokenB.address

    if (tokenAApproved || tokenBApproved) {
      setIsApprovalModalOpen(false)
      setPendingApprovalToken(null)

      if (tokenAApproved) tokenAAllowance.refetchAllowance()
      if (tokenBApproved) tokenBAllowance.refetchAllowance()

      // Auto-proceed with add liquidity after approval
      setTimeout(() => {
        handleAddLiquidity()
      }, 1000)
    }
  }, [tokenAAllowance.isConfirmed, tokenBAllowance.isConfirmed])

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Pool</h2>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 mb-6">
            <button
              onClick={() => setActiveTab('add')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors ${activeTab === 'add'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
            <button
              onClick={() => setActiveTab('remove')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors ${activeTab === 'remove'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
            >
              <Minus className="w-4 h-4" />
              <span>Remove</span>
            </button>
          </div>

          {activeTab === 'add' ? (
            <div className="space-y-4">
              {/* Token A Input */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Token A</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Balance: {formatBalance(tokenAAllowance.balance)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="0.0"
                    value={amountA}
                    onChange={(e) => setAmountA(e.target.value)}
                    className="flex-1 min-w-0 text-2xl font-medium bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
                  />
                  <button
                    onClick={() => openTokenSelect('A')}
                    className="flex items-center space-x-2 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 transition-colors flex-shrink-0"
                  >
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                        {tokenA.symbol.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">{tokenA.symbol}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Token B Input */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Token B</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Balance: {formatBalance(tokenBAllowance.balance)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="0.0"
                    value={amountB}
                    onChange={(e) => setAmountB(e.target.value)}
                    className="flex-1 min-w-0 text-2xl font-medium bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
                  />
                  <button
                    onClick={() => openTokenSelect('B')}
                    className="flex items-center space-x-2 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 transition-colors flex-shrink-0"
                  >
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                        {tokenB.symbol.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">{tokenB.symbol}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {reserves && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Pool Information</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Reserve A:</span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {Array.isArray(reserves) ? formatBalance(reserves[0]) : '0.00'} {tokenA.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Reserve B:</span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {Array.isArray(reserves) ? formatBalance(reserves[1]) : '0.00'} {tokenB.symbol}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddLiquidity}
                disabled={isAddLiquidityDisabled()}
                className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-4 px-4 rounded-2xl transition-colors"
              >
                {getAddLiquidityButtonText()}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Liquidity Amount</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Your Liquidity: {formatBalance(lpBalance)}
                  </span>
                </div>
                <input
                  type="number"
                  placeholder="0.0"
                  value={liquidityAmount}
                  onChange={(e) => setLiquidityAmount(e.target.value)}
                  className="w-full text-2xl font-medium bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Remove liquidity from {tokenA.symbol}/{tokenB.symbol} pool
              </div>

              <button
                onClick={handleRemoveLiquidity}
                disabled={isRemoveLiquidityDisabled()}
                className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-4 px-4 rounded-2xl transition-colors"
              >
                {getRemoveLiquidityButtonText()}
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

      <ApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => {
          setIsApprovalModalOpen(false)
          setPendingApprovalToken(null)
        }}
        onApprove={handleApproval}
        token={pendingApprovalToken || tokenA}
        isPending={
          (pendingApprovalToken?.address === tokenA.address && tokenAAllowance.isPending) ||
          (pendingApprovalToken?.address === tokenB.address && tokenBAllowance.isPending)
        }
        isConfirming={
          (pendingApprovalToken?.address === tokenA.address && tokenAAllowance.isConfirming) ||
          (pendingApprovalToken?.address === tokenB.address && tokenBAllowance.isConfirming)
        }
        error={
          pendingApprovalToken?.address === tokenA.address
            ? tokenAAllowance.error?.message
            : tokenBAllowance.error?.message
        }
      />
    </div>
  )
}