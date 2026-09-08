interface DashboardButtonProps {
  isDisabled: boolean,
  handleClick: () => void,
  title: string
}

const DashboardButton = ({ handleClick, isDisabled, title }: DashboardButtonProps) => {
  return (
    <button 
      className={`${isDisabled ? 'cursor-not-allowed brightness-75' : 'cursor-pointer hover:brightness-130 active:brightness-150'}
        w-1/3 h-15 bg-secondary rounded-lg text-xl font-semibold duration-300  
      `}
      onDoubleClick={handleClick}  
    >
      { title }
    </button>
  )
}

export default DashboardButton