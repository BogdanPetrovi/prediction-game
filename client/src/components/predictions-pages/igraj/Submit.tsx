const Submit = ({ handleSubmit }: { handleSubmit: () => void }) => {
  return (
    <button
      onClick={handleSubmit}
      className="bg-secondary hover:brightness-125 active:brightness-150
              w-4/5 lg:w-1/3 h-16 rounded-3xl font-bold text-4xl
              cursor-pointer shadow-lg shadow-black/40
              hover:scale-[1.02] active:scale-[0.97] duration-300"
    >
      Potvrdi
    </button>
  )
}

export default Submit