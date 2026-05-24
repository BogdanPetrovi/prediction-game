import { Dispatch, SetStateAction } from "react"
import MyPosition from "../MyPosition";

interface ShortcutTableButtonsProps {
  page: number,
  setPage: Dispatch<SetStateAction<number>>
}

export default function ShortcutTableButtons({ page, setPage }: ShortcutTableButtonsProps) {
  return (
    <>
      <MyPosition page={page} setPage={setPage} />
      <button 
        className={`
          ${page === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-light-secondary"}
          flex items-center gap-2 px-2 py-1 bg-secondary border border-slate-700 rounded-md text-sm font-bold text-slate-200`}
        onClick={() => setPage(1)}  
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
        </svg>
        Do vrha
      </button>
    </>
  )
}