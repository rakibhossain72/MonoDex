import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useDexContract } from '@/hooks/useDexContract'
import { ArrowUpDown, Loader2 } from 'lucide-react'

// Mock token list - replace with actual token data
const TOKENS = [
  { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', name: 'Ethereum' },
  { symbol: 'USDC', address: '0xa0b86a33e6304c8749939df2c4b6ee7a8b8b8b8b8', name: 'USD Coin' },
  { symbol: 'DAI', address: '0x6b175474e89094c44da98b954eedeac495271d0f', name: 'Dai Stablecoin' },
]

export function SwapForm() {
  const { isConnected } = useAccount()
  const { swapTokens, isPending, isConfirming, error } = useDexContract()
  
  const [tokenA, setTokenA] = useState(TOKENS[0])
  const [tokenB, setTokenB] = useState(TOKENS[1])
  const [amountIn, setAmountIn] = useState('')
  const [estimatedOut, setEstimatedOut] = useState('')

  const handleSwap = () => {
    if (!amountIn || !tokenA || !tokenB) return
    swapTokens(tokenA.address, tokenB.address, amountIn)
  }

  const switchTokens = () => {
    setTokenA(tokenB)
    setTokenB(tokenA)
    setAmountIn(estimatedOut)
    setEstimatedOut(amountIn)
  }

  const calculateEstimatedOutput = (input: string) => {
    // Mock calculation - replace with actual DEX math
    const amount = parseFloat(input)
    if (isNaN(amount)) {
      setEstimatedOut('')
      return
    }
    // Simple mock: assume 1:1 ratio with 0.3% fee
    const output = amount * 0.997
    setEstimatedOut(output.toFixed(6))
  }

  const handleAmountChange = (value: string) => {
    setAmountIn(value)
    calculateEstimatedOutput(value)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Swap Tokens</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">From</label>
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
              value={amountIn}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={switchTokens}
            className="rounded-full border border-gray-700"
          >
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-400">To</label>
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
              value={estimatedOut}
              readOnly
              className="flex-1 bg-gray-800"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-400 text-sm p-3 bg-red-900/20 rounded-md">
            {error.message}
          </div>
        )}

        <Button
          onClick={handleSwap}
          disabled={!isConnected || !amountIn || isPending || isConfirming}
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
            'Swap'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}