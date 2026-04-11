export default function SaveEventButton({ saveEvent, isDisabled }: { saveEvent: () => void, isDisabled: boolean}) {
  return <button onClick={saveEvent} disabled={isDisabled} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-green-300 text-green-300 text-md font-bold cursor-pointer hover:bg-green-500 hover:text-green-900 duration-300 disabled:cursor-not-allowed disabled:border-green-800 disabled:bg-transparent disabled:text-green-800 disabled:hover:bg-transparent disabled:hover:text-green-800">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
            Sačuvaj turnir
          </button>
}