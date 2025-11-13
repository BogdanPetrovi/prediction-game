'use client'

import React, { useState } from "react"

interface PredictionBoxProps {
  correctPrediction?: boolean,
  teamLogo: string,
  result: string
}

const PredictionBox:React.FC<PredictionBoxProps> = ({ correctPrediction, teamLogo, result }) => {
  const [isActive, setIsActive] = useState(false)
  const [startClosing, setStartClosing] = useState(false)

  const handleMouseLeave = async () => {
    setStartClosing(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsActive(false)
    setStartClosing(false)
  }

  return (
    <div className="relative flex">
      <div className={`size-20 flex justify-center items-center ${correctPrediction ? ' bg-green-600' : ' bg-red-600'}`} onMouseOver={() => setIsActive(true)} onMouseLeave={handleMouseLeave}>
        <img className="size-16 drop-shadow-lg/100" src={ teamLogo } />
      </div>
      {
        isActive &&
         <div className={`${startClosing ? 'close ' : ''} h-20 bg-white prediction-box font-bold text-black flex justify-center items-center`} >
          { result }
         </div>
      }
    </div>
  )
}

export default PredictionBox