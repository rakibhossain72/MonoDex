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
    address: '0xD3193d5138a27B3776b2F5CA21f3eF95347260e3',
    symbol: 'TKB',
    name: 'Token B',
    decimals: 18,
  }
]