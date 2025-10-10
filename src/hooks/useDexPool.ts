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
    inputs: [{ name: "_feeBP", type: "uint256" }],
    name: "setFeeBP",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    "inputs": [
        {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
        },
        {
            "internalType": "address",
            "name": "",
            "type": "address"
        }
    ],
    "name": "lpBalances",
    "outputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ],
    "stateMutability": "view",
    "type": "function"
}
] as const

export function useDexPool() {
  const { address } = useAccount()
  const { writeContract, data: hash, error, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  // Read contract functions (shared with swap)
  const getReserves = (tokenA: string, tokenB: string) => {
    return useReadContract({
      address: DEX_CONTRACT_ADDRESS,
      abi: MONODEX_ABI,
      functionName: 'getReserves',
      args: [tokenA as `0x${string}`, tokenB as `0x${string}`],
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


  const liquidityBalance = (pairId: string, user: string) => {
    return useReadContract({
      address: DEX_CONTRACT_ADDRESS,
        abi: MONODEX_ABI,
        functionName: 'lpBalances',
        args: [pairId as `0x${string}`, user as `0x${string}`],
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
    getPairId,
    liquidityBalance,
    
    // Write Functions
    createPair,
    addLiquidity,
    removeLiquidity,
    setFeeBP,
  }
}