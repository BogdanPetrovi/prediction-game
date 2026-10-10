'use client'

import type CalculationScheduleType from "@/types/CalculationSchedule"
import { formatDateTime } from "@/utils/formatDate"
import { useState } from "react"

const allHours = Array.from({ length: 24 }, (_, hour) => hour)

interface CalculationScheduleProps {
  schedule: CalculationScheduleType,
  isPending: boolean,
  onSave: (hours: number[]) => void
}

export default function CalculationSchedule({ schedule, isPending, onSave }: CalculationScheduleProps) {
  const [selected, setSelected] = useState<number[]>(schedule.hours)

  const isChanged = selected.join() !== schedule.hours.join()
  const isDisabled = isPending || selected.length === 0 || !isChanged

  const toggleHour = (hour: number) => {
    setSelected(prev => prev.includes(hour)
      ? prev.filter(h => h !== hour)
      : [...prev, hour].sort((a, b) => a - b)
    )
  }

  return (
    <div className="w-1/3 mt-8 bg-secondary rounded-xl border p-6 flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Automatsko računanje poena</h2>
      <p className="text-muted">Izaberite sate (po srpskom vremenu) u kojima se poeni računaju.</p>
      <div className="grid grid-cols-6 gap-2">
        {
          allHours.map(hour => (
            <div
              key={hour}
              className={`${selected.includes(hour) ? 'border-green-600 bg-green-600/20' : 'bg-white/5'} text-center py-2 rounded-lg border cursor-pointer select-none duration-200`}
              onClick={() => toggleHour(hour)}
            >
              { String(hour).padStart(2, '0') }:00
            </div>
          ))
        }
      </div>
      {
        schedule.nextCalculation &&
          <h4 className="text-sm">Sledeće računanje: { formatDateTime(schedule.nextCalculation) }</h4>
      }
      <button
        className={`${isDisabled ? 'cursor-not-allowed brightness-75' : 'cursor-pointer hover:bg-white/10 active:bg-white/15'}
          w-full h-12 bg-white/5 rounded-lg border text-lg font-semibold duration-300
        `}
        onClick={() => onSave(selected)}
        disabled={isDisabled}
      >
        Sačuvaj satnicu
      </button>
    </div>
  )
}
