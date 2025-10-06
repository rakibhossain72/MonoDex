import { useState } from 'react'
import { X } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { slippage, setSlippage } = useSettings()
  const [tempSlippage, setTempSlippage] = useState(slippage.toString())

  const presetSlippages = [0.1, 0.5, 1.0]

  const handleSave = () => {
    const value = parseFloat(tempSlippage)
    if (!isNaN(value) && value >= 0 && value <= 50) {
      setSlippage(value)
      onClose()
    }
  }

  const handlePresetClick = (value: number) => {
    setTempSlippage(value.toString())
    setSlippage(value)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Slippage Tolerance
            </label>
            <div className="flex space-x-2 mb-3">
              {presetSlippages.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePresetClick(preset)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    slippage === preset
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {preset}%
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                max="50"
                step="0.1"
                value={tempSlippage}
                onChange={(e) => setTempSlippage(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Custom"
              />
              <span className="text-gray-500 dark:text-gray-400">%</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Your transaction will revert if the price changes unfavorably by more than this percentage.
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}