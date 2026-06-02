"use client"

import PrizesInput from "@/components/admin/PrizesInput"
import Toast from "@/components/shared/Toast"
import backend from "@/services/api/backend"
import { useState } from "react"

export default function Nagrade() {
  const [eventId, setEventId] = useState('')
  const [placement, setPlacement] = useState('')
  const [skinName, setSkinName] = useState('')
  const [skinImage, setSkinImage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const handleClick = async () => {
    try {
      const result = await backend.post('/admin/add-prize', {
        prize: {
          eventId,
          place: Number(placement),
          skinName,
          skinImage
        }
      })
      setToastMessage('Uspešno ste ubacili skin!')
      setToastType("success")
      setShowToast(true)
    } catch (err) {
      console.error(err)
      setToastMessage("Nismo uspeli da ubacimo skin, pogledajte konzolu!")
      setToastType("error")
      setShowToast(true)
    }
  }

  return(
  <>
    <div className="w-screen min-h-[calc(100vh-4.5rem)] mb-5 pt-12 flex flex-col items-center">
      <div className="w-full bg-[#2b3040] max-w-[780px] border border-green-500 rounded-[14px] relative z-10 overflow-hidden">
        <div className="px-9 py-8">
          <p className="text-sm font-bold tracking-[3px] uppercase text-muted mb-3">
            Dodaj skinove za turnir
          </p>
          <div className="flex flex-col sm:flex-row gap-3 items-end mb-5">
            <PrizesInput title="ID turnira" placeholder="npr. 8302" type="number" value={eventId} setValue={setEventId} />
            <PrizesInput title="Za mesto" placeholder="1, 2 ili 3" type="number" value={placement} setValue={setPlacement} />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <PrizesInput title="Ime skina" placeholder="npr. AWP | Asiimov (FN)" type="text" value={skinName} setValue={setSkinName} />
            <PrizesInput title="Slika skina" placeholder="URL Slike sa countersite.gg" type="text" value={skinImage} setValue={setSkinImage} />
          </div>
        </div>
        <button className="w-full h-10 cursor-pointer bg-admin-input hover:brightness-125 active:brightness-150 duration-300" onClick={handleClick}>
          Potvrdi
        </button>
      </div>
    </div>
    {showToast && (
      <Toast 
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
        duration={3000}
      />
    )}
  </>
  )
}