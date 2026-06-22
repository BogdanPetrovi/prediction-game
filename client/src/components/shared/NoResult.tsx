interface NoResultProps {
  title: string
  subtitle: string
}

const NoResult = ({ title, subtitle }: NoResultProps) => {
  return (
    <div
      className={'flex flex-col items-center justify-center min-h-[60vh] px-6 text-center slide-down'}
    >
      <div className="mb-8 flex items-center justify-center gap-3.5">
        <div className="w-4 h-14 rounded-full bg-gradient-to-b from-[#667EEA] to-[#9333EA]" />
        <div className="w-4 h-14 rounded-full bg-gradient-to-b from-[#F39C12] to-[#FFA500]" />
      </div>

      <h2 className="text-2xl font-extrabold text-white mb-3 tracking-tight">{title}</h2>

      <p className="text-slate-300 text-base leading-relaxed max-w-[280px]">
        {subtitle}
      </p>

      <div className="mt-8 flex items-center gap-0.5">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#667EEA]" />
        <div className="h-px w-16 bg-gradient-to-r from-[#F39C12] to-transparent" />
      </div>
    </div>
  )
}

export default NoResult