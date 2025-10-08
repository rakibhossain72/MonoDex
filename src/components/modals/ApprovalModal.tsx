import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Token } from '@/types/token'

interface ApprovalModalProps {
  isOpen: boolean
  onClose: () => void
  onApprove: () => void
  token: Token
  isPending: boolean
  isConfirming: boolean
  error?: string
}

export function ApprovalModal({ 
  isOpen, 
  onClose, 
  onApprove, 
  token, 
  isPending, 
  isConfirming, 
  error 
}: ApprovalModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Token Approval Required
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {token.symbol.charAt(0)}
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">{token.symbol}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{token.name}</div>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>
              To use {token.symbol} with MonoDEX, you need to approve the contract to spend your tokens.
            </p>
            <p>
              This is a one-time approval that allows unlimited spending, so you won't need to approve again for future transactions.
            </p>
          </div>

          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isPending || isConfirming}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onApprove}
              disabled={isPending || isConfirming}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isPending ? 'Confirming...' : 'Processing...'}</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve {token.symbol}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}