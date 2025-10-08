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

const DEX_CONTRACT_ADDRESS = import.meta.env.VITE_DEX_CONTRACT_ADDRESS as `0x${string}`

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
    args: address && DEX_CONTRACT_ADDRESS ? [address, DEX_CONTRACT_ADDRESS] : undefined,
    query: {
      enabled: !!address && !!tokenAddress && tokenAddress !== '0x0000000000000000000000000000000000000000'
    }
  })

  // Get token balance
  const { data: balance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!tokenAddress && tokenAddress !== '0x0000000000000000000000000000000000000000'
    }
  })

  // Get token decimals
  const { data: decimals } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: {
      enabled: !!tokenAddress && tokenAddress !== '0x0000000000000000000000000000000000000000'
    }
  })

  // Check if allowance is sufficient for a given amount
  const hasAllowance = (amount: string) => {
    if (!allowance || !decimals) return false
    if (tokenAddress === '0x0000000000000000000000000000000000000000') return true // ETH doesn't need approval
    
    try {
      const requiredAmount = parseUnits(amount, decimals)
      return allowance >= requiredAmount
    } catch {
      return false
    }
  }

  // Approve unlimited allowance
  const approveToken = () => {
    if (!address || tokenAddress === '0x0000000000000000000000000000000000000000') return
    
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