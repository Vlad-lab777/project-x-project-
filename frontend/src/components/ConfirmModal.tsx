interface ConfirmModalProps {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-center">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Підтвердження</h2>
        </div>
        <div className="px-6 py-5 flex justify-center">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">{message}</p>
        </div>
        <div className="px-6 pb-5 flex gap-2 justify-center">
          <button
            onClick={onCancel}
            className="text-sm px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Ні
          </button>
          <button
            onClick={onConfirm}
            className="text-sm px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
          >
            Так
          </button>
        </div>
      </div>
    </div>
  )
}
