import PendingNotification from "@/types/PendingNotification"

interface PendingNotificationsProps {
  matches: PendingNotification[],
  isPending: boolean,
  onSend: () => void
}

export default function PendingNotifications({ matches, isPending, onSend }: PendingNotificationsProps) {
  const isDisabled = isPending || matches.length === 0

  return (
    <div className="w-full max-w-[780px] mt-10 bg-secondary rounded-xl border p-6 flex flex-col gap-4">
      <h2 className="text-3xl font-bold">Čeka na notifikaciju ({ matches.length })</h2>
      {
        matches.length === 0
        ? <p className="text-muted">Nema mečeva koji čekaju notifikaciju.</p>
        : <ul className="flex flex-col gap-2">
          {
            matches.map((match, index) => (
              <li key={index} className="px-4 py-3 rounded-lg border bg-white/5">
                { match.team1Name } vs { match.team2Name }
              </li>
            ))
          }
        </ul>
      }
      <button
        className={`${isDisabled ? 'cursor-not-allowed brightness-75' : 'cursor-pointer hover:bg-white/10 active:bg-white/15'}
          w-full h-12 bg-white/5 rounded-lg border text-lg font-semibold duration-300
        `}
        onClick={onSend}
        disabled={isDisabled}
      >
        Pošalji notifikaciju
      </button>
    </div>
  )
}
