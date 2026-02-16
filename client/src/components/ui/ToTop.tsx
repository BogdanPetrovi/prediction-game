import React from "react"

interface ToTopProps {
  handleClick: () => void
}

const ToTop:React.FC<ToTopProps> = ({ handleClick }) => {
  return (
    <div className="font-semibold text-xl xl:text-2xl cursor-pointer hover:text-blue-200 active:text-blue-400 duration-200" onClick={handleClick}>
      <h2>Do vrha</h2>
    </div>
  )
}

export default ToTop