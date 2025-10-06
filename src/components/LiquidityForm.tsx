import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useDexContract } from '@/hooks/useDexContract'
import { Loader as Loader2, Plus, Minus } from 'lucide-react'

// Mock token list - same as SwapForm
const TOKENS = [
  { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', name: 'Ethereum' },
  { symbol: 'USDC', address: '0xa0b86a33e6304c8749939df2c4b6ee7a8b8b8b8b8', name: 'USD Coin' },
  { symbol: 'DAI', address: '0x6b175474e89094c44da98b954eedeac495271d0f', name: 'Dai Stablecoin' },
]

export function LiquidityForm() {
  const { isConnected } = useAccount()
  const { addLiquidity, removeLiquidity, isPending, isConfirming, error, reserves } = useDexContract()
  
  const [tokenA, setTokenA] = useState(TOKENS[0])
  const [tokenB, setTokenB] = useState(TOKENS[1])
  const [amountA, setAmountA] = useState('')
  const [amountB, setAmountB] = useState('')
  const [liquidityAmount, setLiquidityAmount] = useState('')

  const handleAddLiquidity = () => {
    if (!amountA || !amountB || !tokenA || !tokenB) return
    addLiquidity(tokenA.address, tokenB.address, amountA, amountB)
  }

  const handleRemoveLiquidity = () => {
    if (!liquidityAmount || !tokenA || !tokenB) return
    removeLiquidity(tokenA.address, tokenB.address, liquidityAmount)
  }

  return (
    <div className="space-y-6">
      {/* Add Liquidity */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add Liquidity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Token A</label>
            <div className="flex space-x-2">
              <select
                value={tokenA.address}
                onChange={(e) => setTokenA(TOKENS.find(t => t.address === e.target.value)!)}
                className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {TOKENS.map((token) => (
                  <option key={token.address} value={token.address}>
                    {token.symbol}
                  </option>
                ))}
              </select>
              <Input
                type="number"
                placeholder="0.0"
                value={amountA}
                onChange={(e) => setAmountA(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Token B</label>
            <div className="flex space-x-2">
              <select
                value={tokenB.address}
                onChange={(e) => setTokenB(TOKENS.find(t => t.address === e.target.value)!)}
                className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {TOKENS.map((token) => (
                  <option key={token.address} value={token.address}>
                    {token.symbol}
                  </option>
                ))}
              </select>
              <Input
                type="number"
                placeholder="0.0"
                value={amountB}
                onChange={(e) => setAmountB(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {reserves && (
            <div className="text-sm text-gray-400 bg-gray-900 p-3 rounded-md">
              <div className="flex justify-between">
                <span>Pool Reserve A:</span>
                <span>{parseFloat(reserves.reserveA).toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span>Pool Reserve B:</span>
                <span>{parseFloat(reserves.reserveB).toFixed(4)}</span>
              </div>
            </div>
          )}

          <Button
            onClick={handleAddLiquidity}
            disabled={!isConnected || !amountA || !amountB || isPending || isConfirming}
            className="w-full"
            size="lg"
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isPending ? 'Confirming...' : 'Processing...'}
              </>
            ) : !isConnected ? (
              'Connect Wallet'
            ) : (
              'Add Liquidity'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Remove Liquidity */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center space-x-2">
            <Minus className="w-5 h-5" />
            <span>Remove Liquidity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Liquidity Amount</label>
            <Input
              type="number"
              placeholder="0.0"
              value={liquidityAmount}
              onChange={(e) => setLiquidityAmount(e.target.value)}
            />
          </div>

          <div className="text-xs text-gray-500">
            Remove liquidity from {tokenA.symbol}/{tokenB.symbol} pool
          </div>

          <Button
            onClick={handleRemoveLiquidity}
            disabled={!isConnected || !liquidityAmount || isPending || isConfirming}
            className="w-full"
            size="lg"
            variant="secondary"
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isPending ? 'Confirming...' : 'Processing...'}
              </>
            ) : !isConnected ? (
              'Connect Wallet'
            ) : (
              'Remove Liquidity'
            )}
          </Button>

          {error && (
            <div className="text-red-400 text-sm p-3 bg-red-900/20 rounded-md">
              {error.message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}