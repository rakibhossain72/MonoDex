import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { parseEther } from 'viem'

const DEX_CONTRACT_ADDRESS = "0x31Bb5C3ce3d22F7328Fb3ff1F99F223272AF2B51";

const MONODEX_ABI = [
  {
    inputs: [
      { name: "tokenA", type: "address" },
      { name: "tokenB", type: "address" }
    ],
    name: "_pairId",
    outputs: [{ name: "pairId", type: "bytes32" }],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [
      { name: "tokenA", type: "address" },
      { name: "tokenB", type: "address" }
    ],
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
      { name: "amountIn", type: "uint256" },
      { name: "reserveIn", type: "uint256" },
      { name: "reserveOut", type: "uint256" }
    ],
    name: "getAmountOut",
    outputs: [{ name: "amountOut", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "tokenIn", type: "address" },
      { name: "tokenOut", type: "address" },
      { name: "amountIn", type: "uint256" },
      { name: "minAmountOut", type: "uint256" },
      { name: "to", type: "address" }
    ],
    name: "swapExactTokensForTokens",
    outputs: [{ name: "amountOut", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const

export function useDexSwap() {
  const { address } = useAccount()
  const { writeContract, data: hash, error, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  // Read contract functions
  const getReserves = (tokenA: string, tokenB: string) => {
    return useReadContract({
      address: DEX_CONTRACT_ADDRESS,
      abi: MONODEX_ABI,
      functionName: 'getReserves',
      args: [tokenA as `0x${string}`, tokenB as `0x${string}`],
    })
  }

  const getAmountOut = (amountIn: string, reserveIn: string, reserveOut: string) => {
    return useReadContract({
      address: DEX_CONTRACT_ADDRESS,
      abi: MONODEX_ABI,
      functionName: 'getAmountOut',
      args: [parseEther(amountIn), parseEther(reserveIn), parseEther(reserveOut)],
    })
  }

  const getPairId = (tokenA: string, tokenB: string) => {
    return useReadContract({
      address: DEX_CONTRACT_ADDRESS,
      abi: MONODEX_ABI,
      functionName: '_pairId',
      args: [tokenA as `0x${string}`, tokenB as `0x${string}`],
    })
  }

  // Write contract functions
  const swapTokens = (tokenIn: string, tokenOut: string, amountIn: string, minAmountOut: string = '0') => {
    if (!address) return
    
    writeContract({
      address: DEX_CONTRACT_ADDRESS,
      abi: MONODEX_ABI,
      functionName: 'swapExactTokensForTokens',
      args: [
        tokenIn as `0x${string}`, 
        tokenOut as `0x${string}`, 
        parseEther(amountIn),
        parseEther(minAmountOut),
        address
      ],
    })
  }

  return {
    // State
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
    
    // Read Functions
    getReserves,
    getAmountOut,
    getPairId,
    
    // Write Functions
    swapTokens,
  }
}