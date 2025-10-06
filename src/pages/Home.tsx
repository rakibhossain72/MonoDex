import { SwapForm } from '@/components/SwapForm'
import { LiquidityForm } from '@/components/LiquidityForm'

export function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid lg:grid-cols-2 gap-8 place-items-center">
        <div className="w-full flex justify-center">
          <SwapForm />
        </div>
        
        <div className="w-full flex justify-center">
          <LiquidityForm />
        </div>
      </div>
      
      <div className="mt-12 text-center text-gray-400 text-sm max-w-2xl mx-auto">
        <p className="mb-2">
          This is a testnet DEX interface. Do not use real funds.
        </p>
        <p>
          Connect your wallet to start swapping tokens and providing liquidity. 
          Make sure you're connected to the correct testnet.
        </p>
      </div>
    </main>
  )
}