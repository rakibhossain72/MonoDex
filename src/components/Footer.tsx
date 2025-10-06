import { Github } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black mt-16">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-400">
            © 2025 DEX Frontend. Built for testnet use only.
          </div>
          
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-100 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <span className="text-gray-600">|</span>
            <div className="text-xs text-gray-500">
              Powered by Wagmi & Viem
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}