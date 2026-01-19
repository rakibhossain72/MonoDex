import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useDexContract } from '@/hooks/useDexContract'
import { ArrowUpDown, Loader as Loader2 } from 'lucide-react'

// Mock token list - replace with actual token data
const TOKENS = [
  { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', name: 'Ethereum', icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' },
  { symbol: 'USDC', address: '0x1aEc00C7185aE6ee82EE4679C8c32b4F7aaC040e', name: 'USD Coin', icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png' },
  { symbol: 'DAI', address: '0x6b175474e89094c44da98b954eedeac495271d0f', name: 'Dai Stablecoin', icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271F0F/logo.png' },
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
    const amount = parseFloat(input)
    if (isNaN(amount)) {
      setEstimatedOut('')
      return
    }
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
        <div className="space-y-2 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">From</label>
            <span className="text-xs text-gray-500">Balance: 0.0</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-750 transition-colors shrink-0">
              <img src={tokenA.icon} alt={tokenA.symbol} className="w-6 h-6 rounded-full" />
              <select
                value={tokenA.address}
                onChange={(e) => setTokenA(TOKENS.find(t => t.address === e.target.value)!)}
                className="bg-transparent text-gray-100 font-bold focus:outline-none cursor-pointer appearance-none pr-1"
              >
                {TOKENS.map((token) => (
                  <option key={token.address} value={token.address} className="bg-gray-900">
                    {token.symbol}
                  </option>
                ))}
              </select>
            </div>
            <Input
              type="number"
              placeholder="0.0"
              value={amountIn}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="flex-1 bg-transparent border-none text-2xl font-medium focus:ring-0 p-0 text-right h-auto"
            />
          </div>
        </div>

        <div className="flex justify-center -my-6 relative z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={switchTokens}
            className="rounded-xl border border-gray-700 bg-gray-900 hover:bg-gray-800 shadow-lg p-2 h-10 w-10"
          >
            <ArrowUpDown className="w-5 h-5 text-blue-400" />
          </Button>
        </div>

        <div className="space-y-2 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">To</label>
            <span className="text-xs text-gray-500">Balance: 0.0</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-750 transition-colors shrink-0">
              <img src={tokenB.icon} alt={tokenB.symbol} className="w-6 h-6 rounded-full" />
              <select
                value={tokenB.address}
                onChange={(e) => setTokenB(TOKENS.find(t => t.address === e.target.value)!)}
                className="bg-transparent text-gray-100 font-bold focus:outline-none cursor-pointer appearance-none pr-1"
              >
                {TOKENS.map((token) => (
                  <option key={token.address} value={token.address} className="bg-gray-900">
                    {token.symbol}
                  </option>
                ))}
              </select>
            </div>
            <Input
              type="number"
              placeholder="0.0"
              value={estimatedOut}
              readOnly
              className="flex-1 bg-transparent border-none text-2xl font-medium focus:ring-0 p-0 text-right h-auto"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-400 text-xs p-3 bg-red-900/10 border border-red-900/50 rounded-lg">
            {error.message}
          </div>
        )}

        <Button
          onClick={handleSwap}
          disabled={!isConnected || !amountIn || isPending || isConfirming}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 rounded-xl transition-all shadow-lg active:scale-[0.98]"
          size="lg"
        >
          {isPending || isConfirming ? (
            <>
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              {isPending ? 'Confirming Swap...' : 'Executing Swap...'}
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