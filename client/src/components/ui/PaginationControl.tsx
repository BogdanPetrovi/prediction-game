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
        className={`${page === totalPages ? 'text-neutral-500 cursor-not-allowed ' : 'cursor-pointer hover:text-blue-200 active:text-blue-400 duration-200'} font-extrabold`}> 
        &gt; 
      </button>
    )
  }

  return (
    <button onClick={() => setPage((prev) => 
      {if(prev === 1) {
        return 1
      } else 
        return prev-1 })} 
      className={`${page === 1 ? 'text-neutral-500 cursor-not-allowed ' : 'cursor-pointer hover:text-blue-200 active:text-blue-400 duration-200 '} font-extrabold `}> 
      &lt; 
    </button>
  )
}

export default PaginationControl