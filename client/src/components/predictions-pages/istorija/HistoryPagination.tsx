interface HistoryPaginationProps {
  page: number
  totalPages: number
  totalEvents: number
  pageSize: number
  onPageChange: (page: number) => void
}

type PageItem = number | "ellipsis"

const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i)

const getPageItems = (page: number, totalPages: number): PageItem[] => {
  if (totalPages <= 7) return range(1, totalPages)
  if (page <= 4) return [...range(1, 5), "ellipsis", totalPages]
  if (page >= totalPages - 3) return [1, "ellipsis", ...range(totalPages - 4, totalPages)]
  return [1, "ellipsis", page - 1, page, page + 1, "ellipsis", totalPages]
}

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9333EA]"

const arrowButton = `h-11 min-w-11 px-3 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] text-slate-200 font-semibold text-sm duration-200
  enabled:cursor-pointer enabled:hover:bg-white/10 enabled:hover:border-white/20 enabled:active:scale-95
  disabled:opacity-40 disabled:cursor-not-allowed ${focusRing}`

export default function HistoryPagination({ page, totalPages, totalEvents, pageSize, onPageChange }: HistoryPaginationProps) {
  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalEvents)

  return (
    <nav aria-label="Stranice istorije turnira" className="flex flex-col items-center gap-3">
      <div className="w-full flex items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Prethodna stranica"
          className={arrowButton}
        >
          <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          <span className="hidden sm:inline">Prethodna</span>
        </button>

        <ol className="hidden sm:flex items-center gap-1.5">
          {getPageItems(page, totalPages).map((item, i) => {
            if (item === "ellipsis") {
              return (
                <li key={`ellipsis-${i}`} aria-hidden="true" className="w-6 text-center text-slate-500 font-bold select-none">
                  …
                </li>
              )
            }

            const isActive = item === page

            return (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => onPageChange(item)}
                  aria-label={`Stranica ${item}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`size-10 flex items-center justify-center rounded-xl border font-bold tabular-nums duration-200 ${focusRing} ${
                    isActive
                      ? "border-transparent bg-gradient-to-br from-[#667EEA] to-[#9333EA] text-white shadow-lg shadow-purple-900/40"
                      : "border-white/10 bg-white/[0.04] text-slate-300 cursor-pointer hover:bg-white/10 hover:border-white/20 hover:text-white active:scale-95"
                  }`}
                >
                  {item}
                </button>
              </li>
            )
          })}
        </ol>

        <p className="sm:hidden text-sm font-semibold text-slate-400 tabular-nums">
          Strana <span className="text-white">{page}</span> od {totalPages}
        </p>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Sledeća stranica"
          className={arrowButton}
        >
          <span className="hidden sm:inline">Sledeća</span>
          <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      <p className="text-xs text-slate-500 tabular-nums">
        Turniri {from}–{to} od {totalEvents}
      </p>
    </nav>
  )
}
