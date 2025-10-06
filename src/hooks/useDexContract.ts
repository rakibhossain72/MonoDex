import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'

const DEX_CONTRACT_ADDRESS = import.meta.env.VITE_DEX_CONTRACT_ADDRESS as `0x${string}`

// Basic DEX ABI - replace with your actual contract ABI
const DEX_ABI = [
  {
    inputs: [],
    name: "getReserves",
    outputs: [
      { name: "reserveA", type: "uint256" },
      { name: "reserveB", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "tokenA", type: "address" },
      { name: "tokenB", type: "address" },
      { name: "amountIn", type: "uint256" }
    ],
    name: "swapTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { name: "tokenA", type: "address" },
      { name: "tokenB", type: "address" },
      { name: "amountA", type: "uint256" },
      { name: "amountB", type: "uint256" }
    ],
    name: "addLiquidity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { name: "tokenA", type: "address" },
      { name: "tokenB", type: "address" },
      { name: "liquidity", type: "uint256" }
    ],
    name: "removeLiquidity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const

export function useDexContract() {
  const { writeContract, data: hash, error, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  // Read contract functions
  const { data: reserves, refetch: refetchReserves } = useReadContract({
    address: DEX_CONTRACT_ADDRESS,
    abi: DEX_ABI,
    functionName: 'getReserves',
  })

  // Write contract functions
  const swapTokens = (tokenA: string, tokenB: string, amountIn: string) => {
    writeContract({
      address: DEX_CONTRACT_ADDRESS,
      abi: DEX_ABI,
      functionName: 'swapTokens',
      args: [tokenA as `0x${string}`, tokenB as `0x${string}`, parseEther(amountIn)],
    })
  }

  const addLiquidity = (tokenA: string, tokenB: string, amountA: string, amountB: string) => {
    writeContract({
      address: DEX_CONTRACT_ADDRESS,
      abi: DEX_ABI,
      functionName: 'addLiquidity',
      args: [
        tokenA as `0x${string}`, 
        tokenB as `0x${string}`, 
        parseEther(amountA), 
        parseEther(amountB)
      ],
    })
  }

  const removeLiquidity = (tokenA: string, tokenB: string, liquidity: string) => {
    writeContract({
      address: DEX_CONTRACT_ADDRESS,
      abi: DEX_ABI,
      functionName: 'removeLiquidity',
      args: [tokenA as `0x${string}`, tokenB as `0x${string}`, parseEther(liquidity)],
    })
  }

  return {
    // State
    reserves: reserves ? {
      reserveA: formatEther(reserves[0]),
      reserveB: formatEther(reserves[1])
    } : null,
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
    
    // Functions
    swapTokens,
    addLiquidity,
    removeLiquidity,
    refetchReserves,
  }
}