import { X, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Loader as Loader2 } from 'lucide-react'

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  status: 'pending' | 'success' | 'error' | null
  hash?: string
  error?: string
}

export function TransactionModal({ isOpen, onClose, status, hash, error }: TransactionModalProps) {
  if (!isOpen || !status) return null

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />
      case 'error':
        return <AlertCircle className="w-12 h-12 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Transaction Pending'
      case 'success':
        return 'Transaction Successful'
      case 'error':
        return 'Transaction Failed'
      default:
        return ''
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{getStatusText()}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex flex-col items-center space-y-4">
          {getStatusIcon()}
          
          {status === 'pending' && (
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Please wait while your transaction is being processed...
            </p>
          )}

          {status === 'success' && hash && (
            <div className="text-center space-y-2">
              <p className="text-gray-600 dark:text-gray-400">Your transaction has been confirmed!</p>
              <a
                href={`https://sepolia.etherscan.io/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-pink-600 text-sm underline"
              >
                View on Etherscan
              </a>
            </div>
          )}

          {status === 'error' && (
            <p className="text-red-600 dark:text-red-400 text-center text-sm">
              {error || 'An error occurred while processing your transaction.'}
            </p>
          )}
        </div>

        {status !== 'pending' && (
          <button
            onClick={onClose}
            className="w-full mt-6 bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-4 rounded-xl transition-colors"
          >
            Close
          </button>
        )}
      </div>
    </div>
  )
}