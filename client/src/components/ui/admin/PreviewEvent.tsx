interface PreviewEventProps {
  onConfirm: () => void
}

export default function PreviewEvent({ onConfirm }: PreviewEventProps) {
  return (
    <div className="px-9 py-6 border-t-1 border-green-500/60 slide-down">
      <p className="text-sm font-bold tracking-[3px] uppercase text-muted mb-3">
        Pregled turnira
      </p>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-admin-input border border-admin-border rounded-xl p-7">
        <div className="size-[72px] rounded-lg border overflow-hidden">
          
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold tracking-[2px] uppercase text-accent mb-1">ID: 8211</p>
          <p className="text-3xl font-bold text-[#e8ede8] mb-2 truncate">BLAST Open Rotterdam 2026</p>
          <div className="flex items-center gap-2 text-sm text-muted">
            <span className="bg-[#2b3040] border border-green-500/60 px-3 py-1 rounded-full text-xs font-medium text-[#e8ede8]">10.04.2026</span>
            <span className="text-muted text-xs">→</span>
            <span className="bg-[#2b3040] border border-green-500/60 px-3 py-1 rounded-full text-xs font-medium text-[#e8ede8]">17.04.2026</span>
          </div>
        </div>
        <div className="flex flex-row sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
          <button 
            className="relative flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg bg-[#22c55e] text-[#041a0e] text-md font-bold cursor-pointer duration-300 hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(34,197,94,0.3)] hover:bg-green-400 active:translate-y-0 border-0 overflow-hidden"
            onClick={onConfirm}
            >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Potvrdi
          </button>
          <button
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg bg-transparent border border-borderl text-muted text-sm font-bold cursor-pointer duration-300 hover:border-[#f75a5a] hover:text-[#f75a5a]">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Odbaci
          </button>
        </div>
      </div>
    </div>
  )
}