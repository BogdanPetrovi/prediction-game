import { DefaultError } from "@tanstack/react-query"
import React from "react"


const Error: React.FC<{err: DefaultError}> = ({ err }) => {
  return (
    <div className="w-full flex justify-center items-center text-center">
      <h1 className="text-5xl font-bold text-red-400 leading-snug">
        Oooops, we ran into an error :(<br />
        We are most likely working on it, please try again later!<br />
        {err.message}
        </h1>
    </div>
  )
}

export default Error