import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { parseUnits, maxUint256 } from 'viem'

const ERC20_ABI = [
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" }
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function"
  }
] as const

const DEX_CONTRACT_ADDRESS = "0x31Bb5C3ce3d22F7328Fb3ff1F99F223272AF2B51" as `0x${string}`

export function useTokenAllowance(tokenAddress: string) {
  const { address } = useAccount()
  const { writeContract, data: hash, error, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  // Check current allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, DEX_CONTRACT_ADDRESS] : undefined,
    query: {
      enabled: !!address && !!tokenAddress && tokenAddress !== '0x0000000000000000000000000000000000000000' && tokenAddress.length === 42
    }
  })

  // Get token balance
  const { data: balance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!tokenAddress && tokenAddress !== '0x0000000000000000000000000000000000000000' && tokenAddress.length === 42
    }
  })

  // Get token decimals
  const { data: decimals } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: {
      enabled: !!tokenAddress && tokenAddress !== '0x0000000000000000000000000000000000000000' && tokenAddress.length === 42
    }
  })

  // Check if allowance is sufficient for a given amount
  const hasAllowance = (amount: string) => {
    console.log('Checking allowance for:', { tokenAddress, amount, allowance, decimals })
    
    if (!allowance || !decimals) return false
    if (tokenAddress === '0x0000000000000000000000000000000000000000') return true // ETH doesn't need approval
    if (tokenAddress.length !== 42) return false // Invalid address length
    
    try {
      const requiredAmount = parseUnits(amount, decimals)
      console.log('Required amount:', requiredAmount, 'Current allowance:', allowance)
      return allowance >= requiredAmount
    } catch {
      return false
    }
  }

  // Approve unlimited allowance
  const approveToken = () => {
    console.log('Attempting to approve token:', { tokenAddress, address, DEX_CONTRACT_ADDRESS })
    
    if (!address) {
      console.error('No user address available')
      return
    }
    
    if (tokenAddress === '0x0000000000000000000000000000000000000000') {
      console.log('ETH does not need approval')
      return
    }
    
    if (tokenAddress.length !== 42) {
      console.error('Invalid token address length:', tokenAddress)
      return
    }
    
    writeContract({
      address: tokenAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [DEX_CONTRACT_ADDRESS, maxUint256],
    })
  }

  return {
    allowance,
    balance,
    decimals,
    hasAllowance,
    approveToken,
    refetchAllowance,
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
  }
}