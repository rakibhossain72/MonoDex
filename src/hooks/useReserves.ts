// hooks/useReserves.ts
import { useReadContract } from 'wagmi'

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

export function useReserves(tokenAAddress: string, tokenBAddress: string) {
  return useReadContract({
    address: DEX_CONTRACT_ADDRESS as `0x${string}`,
    abi: MONODEX_ABI,
    functionName: 'getReserves',
    args: [tokenAAddress as `0x${string}`, tokenBAddress as `0x${string}`],
  })
}