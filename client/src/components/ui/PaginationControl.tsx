import React, { Dispatch, SetStateAction } from "react"

interface PaginationControlProps {
  setPage: Dispatch<SetStateAction<number>>,
  page: number,
  totalPages: number,
  direction: 'back' | 'next'
}

const PaginationControl: React.FC<PaginationControlProps> = ({ setPage, page, totalPages, direction }) => {
  if(direction === 'next'){
    return (
      <button onClick={() => setPage((prev) => 
        {if(prev === totalPages) {
          return totalPages
        } else 
          return prev+1 })} 
        className={
          `${page === totalPages ? 'opacity-50 cursor-not-allowed' : 
            'cursor-pointer hover:bg-light-secondary'} 
          p-2 font-extrabold bg-primary border border-slate-700 rounded-md`}
      > 
      <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
      </button>
    )
  }

  return (
    <button onClick={() => setPage((prev) => 
      {if(prev === 1) {
        return 1
      } else 
        return prev-1 })} 
      className={
          `${page === 1 ? 'opacity-50 cursor-not-allowed' : 
            'cursor-pointer hover:bg-light-secondary'} 
          p-2 font-extrabold bg-primary border border-slate-700 rounded-md`}
      >
      <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
      </svg>
    </button>
  )
}

export default PaginationControl