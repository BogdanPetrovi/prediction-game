interface ProfileHistoryErrorProps {
  message: string,
  onRetry: () => void
}

export default function ProfileHistoryError({ message, onRetry }: ProfileHistoryErrorProps) {
  return (
    <div role="alert" className="mt-2 px-3 py-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-700 bg-secondary sg:bg-white sg:border-sg-sand">
      <p className="text-slate-300 sg:text-stone-600">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="min-h-11 px-3 rounded-lg font-semibold cursor-pointer border border-slate-700 text-slate-200 hover:bg-white/5 hover:text-white duration-200
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500
                   sg:bg-sg-crimson sg:border-sg-crimson sg:text-white sg:hover:bg-sg-wine sg:focus-visible:ring-sg-red"
      >
        Pokušaj ponovo
      </button>
    </div>
  )
}
