import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { parseEther, formatEther } from 'viem'

const DEX_CONTRACT_ADDRESS = "0x31Bb5C3ce3d22F7328Fb3ff1F99F223272AF2B51";

// MonoDEX ABI based on the interface
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
      { name: "tokenA", type: "address" },
      { name: "tokenB", type: "address" }
    ],
    name: "createPair",
    outputs: [{ name: "pairId", type: "bytes32" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { name: "tokenA", type: "address" },
      { name: "tokenB", type: "address" },
      { name: "amountA", type: "uint256" },
      { name: "amountB", type: "uint256" },
      { name: "to", type: "address" }
    ],
    name: "addLiquidity",
    outputs: [{ name: "liquidity", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { name: "tokenA", type: "address" },
      { name: "tokenB", type: "address" },
      { name: "liquidity", type: "uint256" },
      { name: "to", type: "address" }
    ],
    name: "removeLiquidity",
    outputs: [
      { name: "amountA", type: "uint256" },
      { name: "amountB", type: "uint256" }
    ],
    stateMutability: "nonpayable",
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
  },
  {
    inputs: [{ name: "_feeBP", type: "uint256" }],
    name: "setFeeBP",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const

export function useDexContract() {
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
  const createPair = (tokenA: string, tokenB: string) => {
    writeContract({
      address: DEX_CONTRACT_ADDRESS,
      abi: MONODEX_ABI,
      functionName: 'createPair',
      args: [tokenA as `0x${string}`, tokenB as `0x${string}`],
    })
  }

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

  const addLiquidity = (tokenA: string, tokenB: string, amountA: string, amountB: string) => {
    if (!address) return
    
    writeContract({
      address: DEX_CONTRACT_ADDRESS,
      abi: MONODEX_ABI,
      functionName: 'addLiquidity',
      args: [
        tokenA as `0x${string}`, 
        tokenB as `0x${string}`, 
        parseEther(amountA), 
        parseEther(amountB),
        address
      ],
    })
  }

  const removeLiquidity = (tokenA: string, tokenB: string, liquidity: string) => {
    if (!address) return
    
    writeContract({
      address: DEX_CONTRACT_ADDRESS,
      abi: MONODEX_ABI,
      functionName: 'removeLiquidity',
      args: [
        tokenA as `0x${string}`, 
        tokenB as `0x${string}`, 
        parseEther(liquidity),
        address
      ],
    })
  }

  const setFeeBP = (feeBP: number) => {
    writeContract({
      address: DEX_CONTRACT_ADDRESS,
      abi: MONODEX_ABI,
      functionName: 'setFeeBP',
      args: [BigInt(feeBP)],
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
    createPair,
    swapTokens,
    addLiquidity,
    removeLiquidity,
    setFeeBP,
  }
}