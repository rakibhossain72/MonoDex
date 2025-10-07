import { X } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { slippage, setSlippage } = useSettings()

  if (!isOpen) return null

  const presetSlippages = [0.1, 0.5, 1.0]

  const handleSlippageChange = (value: number) => {
    setSlippage(value)
  }

  const handleCustomSlippage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value) && value >= 0 && value <= 50) {
      setSlippage(value)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              Slippage Tolerance
            </h3>
            
            <div className="flex space-x-2 mb-3">
              {presetSlippages.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleSlippageChange(preset)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    slippage === preset
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {preset}%
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="number"
                min="0"
                max="50"
                step="0.1"
                value={slippage}
                onChange={handleCustomSlippage}
                placeholder="Custom"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                %
              </span>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Your transaction will revert if the price changes unfavorably by more than this percentage.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-4 rounded-xl transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  )
}