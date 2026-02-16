import { DefaultError } from "@tanstack/react-query"
import React from "react"


const Error: React.FC<{err: DefaultError}> = ({ err }) => {
  return (
    <div className="w-full flex justify-center items-center text-center">
      <h1 className="text-5xl font-bold text-red-400 leading-snug">
        Upsss, došlo je do greške :(<br />
        Najverovatnije radimo na njoj, molimo Vas pokušajte ponovo kasnije!<br />
        {err.message}
      </h1>
    </div>
  )
}

export default Error