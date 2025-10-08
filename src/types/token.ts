export interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
}

export const COMMON_TOKENS: Token[] = [
  {
    address: '0x5C8a6F2c3FF76189af29eF4b43807dEB006Bf579',
    symbol: 'TKA',
    name: 'Token A',
    decimals: 18,
  },
  {
    address: '0x1aEc00C7185aE6ee82EE4679C8c32b4F7aaC040e',
    symbol: 'TKB',
    name: 'Token B',
    decimals: 18,
  }
]