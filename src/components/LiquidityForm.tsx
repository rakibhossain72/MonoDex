import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useDexContract } from '@/hooks/useDexContract'
import { Loader as Loader2, Plus, Minus } from 'lucide-react'

// Mock token list - same as SwapForm
const TOKENS = [
  { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', name: 'Ethereum', icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' },
  { symbol: 'USDC', address: '0xa0b86a33e6304c8749939df2c4b6ee7a8b8b8b8b8', name: 'USD Coin', icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png' },
  { symbol: 'DAI', address: '0x6b175474e89094c44da98b954eedeac495271d0f', name: 'Dai Stablecoin', icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271F0F/logo.png' },
]

export function LiquidityForm() {
  const { isConnected } = useAccount()
  const { addLiquidity, removeLiquidity, isPending, isConfirming, error } = useDexContract()
  
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
      <Card className="w-full max-w-md bg-gray-950 border-gray-800 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center space-x-2 text-gray-100">
            <Plus className="w-5 h-5 text-green-500" />
            <span>Add Liquidity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {/* Token A Input */}
            <div className="space-y-2 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Token A</label>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg shrink-0">
                  <img src={tokenA.icon} alt={tokenA.symbol} className="w-6 h-6 rounded-full" />
                  <select
                    value={tokenA.address}
                    onChange={(e) => setTokenA(TOKENS.find(t => t.address === e.target.value)!)}
                    className="bg-transparent text-gray-100 font-bold focus:outline-none appearance-none pr-1"
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
                  value={amountA}
                  onChange={(e) => setAmountA(e.target.value)}
                  className="flex-1 bg-transparent border-none text-2xl font-medium focus:ring-0 p-0 text-right h-auto"
                />
              </div>
            </div>

            <div className="flex justify-center -my-6 relative z-10">
              <div className="bg-gray-950 p-2 rounded-full border border-gray-800">
                <Plus className="w-4 h-4 text-gray-500" />
              </div>
            </div>

            {/* Token B Input */}
            <div className="space-y-2 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Token B</label>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg shrink-0">
                  <img src={tokenB.icon} alt={tokenB.symbol} className="w-6 h-6 rounded-full" />
                  <select
                    value={tokenB.address}
                    onChange={(e) => setTokenB(TOKENS.find(t => t.address === e.target.value)!)}
                    className="bg-transparent text-gray-100 font-bold focus:outline-none appearance-none pr-1"
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
                  value={amountB}
                  onChange={(e) => setAmountB(e.target.value)}
                  className="flex-1 bg-transparent border-none text-2xl font-medium focus:ring-0 p-0 text-right h-auto"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleAddLiquidity}
            disabled={!isConnected || !amountA || !amountB || isPending || isConfirming}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-6 rounded-xl transition-all shadow-lg"
            size="lg"
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                {isPending ? 'Confirming...' : 'Adding Liquidity...'}
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
      <Card className="w-full max-w-md bg-gray-950 border-gray-800">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center space-x-2 text-gray-100">
            <Minus className="w-5 h-5 text-red-500" />
            <span>Remove Liquidity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Liquidity Amount</label>
            <Input
              type="number"
              placeholder="0.0"
              value={liquidityAmount}
              onChange={(e) => setLiquidityAmount(e.target.value)}
              className="bg-transparent border-none text-2xl font-medium focus:ring-0 p-0 h-auto"
            />
          </div>

          <div className="text-xs text-gray-500 text-center">
            Removing liquidity from <span className="text-gray-300 font-medium">{tokenA.symbol}/{tokenB.symbol}</span> pool
          </div>

          <Button
            onClick={handleRemoveLiquidity}
            disabled={!isConnected || !liquidityAmount || isPending || isConfirming}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-6 rounded-xl"
            size="lg"
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                {isPending ? 'Confirming...' : 'Removing...'}
              </>
            ) : !isConnected ? (
              'Connect Wallet'
            ) : (
              'Remove Liquidity'
            )}
          </Button>

          {error && (
            <div className="text-red-400 text-xs p-3 bg-red-900/10 border border-red-900/50 rounded-lg text-center">
              {error.message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}