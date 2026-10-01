const formats = ['bo1', 'bo3', 'bo5']

interface AddMatchFormatProps {
  format: string,
  setFormat: (format: string) => void
}

export default function AddMatchFormat({ format, setFormat }: AddMatchFormatProps) {
  return (
    <div className="flex flex-col gap-2 flex-1">
      <h4 className="text-sm font-medium">Format</h4>
      <div className="flex gap-2">
        {
          formats.map(f => (
            <div
              key={f}
              className={`${format === f ? 'border-green-600' : ''} flex-1 text-center px-4 py-3 rounded-lg border bg-white/5 uppercase cursor-pointer select-none duration-200`}
              onClick={() => setFormat(f)}
            >
              { f }
            </div>
          ))
        }
      </div>
    </div>
  )
}
