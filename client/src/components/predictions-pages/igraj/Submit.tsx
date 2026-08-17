interface SubmitProps {
  handleSubmit: () => void,
  isDisabled: boolean
}

const Submit = ({ handleSubmit, isDisabled }: SubmitProps) => {
  return (
    <button
      onClick={handleSubmit}
      disabled={isDisabled}
      className="bg-secondary hover:brightness-125 active:brightness-150
              w-4/5 lg:w-1/3 h-16 rounded-3xl font-bold text-4xl
              cursor-pointer shadow-lg shadow-black/40
              hover:scale-[1.02] active:scale-[0.97] duration-300
              disabled:brightness-65 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      Potvrdi
    </button>
  )
}

export default Submit