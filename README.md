# Mono Dex 🦄

A decentralized exchange (DEX) hobby project built on Ethereum Sepolia testnet. MonoDex provides seamless token swapping with an intuitive React-based interface.

![Mono Dex](https://img.shields.io/badge/Testnet-Sepolia-blue)
![Solidity](https://img.shields.io/badge/Solidity-0.8.x-green)
![React](https://img.shields.io/badge/React-18.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)

## 🚀 Features

- **Token Swapping**: Swap ERC-20 tokens with minimal slippage
- **Liquidity Pools**: Add/remove liquidity from pools
- **Wallet Integration**: Seamless wallet connection via RainbowKit
- **Testnet Focus**: Currently deployed on Sepolia testnet
- **Responsive UI**: Built with Tailwind CSS for all devices

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **WAGMI** for Ethereum interactions
- **RainbowKit** for wallet connection

### Smart Contracts
- **Solidity** ^0.8.0
- **Hardhat/Foundry** for development and testing
- **OpenZeppelin** contracts for security

## 📦 Installation

### Prerequisites
- Node.js 20+ 
- npm or yarn
- MetaMask or any Ethereum wallet

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/rakibhossain72/MonoDex.git
cd MonoDex
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

## 🏗 Project Structure

```
MonoDex
├── contracts
│   ├── foundry.toml
│   ├── .gitignore
│   ├── .gitmodules
│   ├── lib
│   │   ├── forge-std
│   │   └── openzeppelin-contracts
│   ├── README.md
│   ├── remappings.txt
│   ├── script
│   │   └── DeployAndProvideLiquidity.s.sol
│   ├── src
│   │   ├── ERC20Mock.sol
│   │   └── MonoDEX.sol
│   └── test
│       └── MonoDEX.t.sol
├── eslint.config.js
├── .gitignore
├── .gitmodules
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── README.md
├── src
│   ├── App.tsx
│   ├── components
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── LiquidityForm.tsx
│   │   ├── modals
│   │   │   ├── ApprovalModal.tsx
│   │   │   ├── SettingsModal.tsx
│   │   │   ├── TokenSelectModal.tsx
│   │   │   └── TransactionModal.tsx
│   │   ├── SwapForm.tsx
│   │   └── ui
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Input.tsx
│   ├── config
│   │   └── wagmi.ts
│   ├── contexts
│   │   ├── SettingsContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks
│   │   ├── useDexContract.ts
│   │   ├── useDexPool.ts
│   │   ├── useDexSwap.ts
│   │   ├── useReserves.ts
│   │   └── useTokenAllowance.ts
│   ├── index.css
│   ├── lib
│   │   └── utils.ts
│   ├── main.tsx
│   ├── pages
│   │   ├── PoolPage.tsx
│   │   └── SwapPage.tsx
│   ├── types
│   │   └── token.ts
│   └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## 🔗 Contract Addresses (Sepolia)

| Contract | Address |
|----------|---------|
| MonoDex | `0x31Bb5C3ce3d22F7328Fb3ff1F99F223272AF2B51` |

## 🎯 Usage

### Connecting Wallet
1. Click "Connect Wallet" button
2. Select your preferred wallet (MetaMask, WalletConnect, etc.)
3. Switch to Sepolia testnet when prompted

### Swapping Tokens
1. Select input and output tokens
2. Enter the amount you want to swap
3. Review the exchange rate and slippage
4. Confirm the transaction in your wallet

### Adding Liquidity
1. Navigate to the "Pool" section
2. Select two tokens and amounts
3. Approve token spending if needed
4. Confirm adding liquidity

## 🧪 Testing

### Smart Contract Tests
```bash
cd contracts
forge test
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run frontend tests
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Network Configuration
The app is configured for Sepolia testnet. To add other networks, update the WAGMI configuration in `src/config/wagmi.ts`.

### Token Lists
Default token lists can be modified in `src/types/token.ts`.

## 🤝 Contributing

This is a hobby project, but contributions and suggestions are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⚠️ Disclaimer

This is a **testnet-only hobby project**. Do not use with real funds. The contracts are unaudited and for educational purposes only.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [WAGMI](https://wagmi.sh) for excellent Ethereum hooks
- [RainbowKit](https://www.rainbowkit.com) for seamless wallet connection
- [Vite](https://vitejs.dev) for fast development experience
- [Tailwind CSS](https://tailwindcss.com) for utility-first CSS

## 📞 Contact

Project Link: [https://github.com/rakibhossain72/MonoDex.git](https://github.com/rakibhossain72/MonoDex.git)

---

**Remember**: This is a testnet deployment. Use only testnet ETH and tokens!
