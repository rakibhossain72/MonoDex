import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi'
import { Button } from '@/components/ui/Button'
import { truncateAddress } from '@/lib/utils'
import { Wallet, LogOut } from 'lucide-react'

export function Header() {
  const { address, isConnected } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 11155111:
        return 'Sepolia'
      case 1:
        return 'Mainnet'
      default:
        return 'Unknown'
    }
  }

  return (
    <header className="border-b border-gray-800 bg-black">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-4xl">
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <h1 className="text-xl font-bold text-white">DEX</h1>
          </div>
          <p className="text-red-500 text-xs mt-1">⚠️ Running on Testnet</p>
        </div>

        <div className="flex items-center space-x-4">
          {isConnected ? (
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-300">
                <div>{truncateAddress(address!)}</div>
                <div className="text-xs text-gray-500">{getNetworkName(chainId)}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => disconnect()}
                className="text-gray-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2">
              {connectors.map((connector) => (
                <Button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  variant="default"
                  size="sm"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect {connector.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}