"use client"

import { FormEvent, KeyboardEvent, useEffect, useId, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import useChangeUsername, { changeUsernameErrorMessage } from "@/utils/mutations/useChangeUsername"
import { usernameStatusQueryOptions } from "@/utils/profileQueryOptions"
import { USERNAME_COOLDOWN_DAYS, USERNAME_MAX_LENGTH, isValidUsername, normalizeUsername, usernameRules } from "@/utils/usernameRules"

type Mode = 'view' | 'edit' | 'confirm'

const primaryButton = `flex-1 sm:flex-none h-11 px-5 inline-flex items-center justify-center gap-2 rounded-lg font-bold cursor-pointer duration-200
  bg-orange-500 text-slate-950 hover:brightness-110 active:brightness-95
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black
  disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100
  sg:bg-sg-crimson sg:text-white sg:shadow-sm sg:shadow-sg-red/25 sg:focus-visible:ring-sg-red sg:focus-visible:ring-offset-sg-cream`

const secondaryButton = `flex-1 sm:flex-none h-11 px-5 inline-flex items-center justify-center rounded-lg font-semibold cursor-pointer duration-200
  border border-slate-700 text-slate-300 hover:bg-white/5 hover:text-white
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500
  disabled:opacity-40 disabled:cursor-not-allowed
  sg:bg-white sg:border-sg-sand sg:text-stone-600 sg:hover:bg-sg-sand/40 sg:hover:text-sg-ink sg:focus-visible:ring-sg-red`

export default function EditableUsername({ username }: { username: string }) {
  const { data: status } = useQuery(usernameStatusQueryOptions())
  const { mutate, isPending } = useChangeUsername()

  const [mode, setMode] = useState<Mode>('view')
  const [value, setValue] = useState(username)
  const [error, setError] = useState<string | null>(null)
  const [highlightKey, setHighlightKey] = useState(0)

  const headingRef = useRef<HTMLHeadingElement>(null)
  const pencilRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)
  const focusOnView = useRef<'heading' | 'pencil' | null>(null)

  const inputId = useId()
  const rulesId = useId()
  const errorId = useId()
  const confirmTitleId = useId()

  const next = normalizeUsername(value)
  const isValid = isValidUsername(next)

  useEffect(() => {
    if(mode === 'edit') inputRef.current?.select()
    if(mode === 'confirm') confirmRef.current?.focus()
    if(mode === 'view' && focusOnView.current) {
      (focusOnView.current === 'heading' ? headingRef : pencilRef).current?.focus()
      focusOnView.current = null
    }
  }, [mode])

  const startEditing = () => {
    setValue(username)
    setError(null)
    setMode('edit')
  }

  const cancel = () => {
    focusOnView.current = 'pencil'
    setMode('view')
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(!isValid) return

    if(next === username) return cancel()

    setMode('confirm')
  }

  const handleConfirm = () => {
    mutate(next, {
      onSuccess: () => {
        focusOnView.current = 'heading'
        setHighlightKey(key => key + 1)
        setMode('view')
      },
      onError: (err) => {
        setError(changeUsernameErrorMessage(err))
        setMode('edit')
      }
    })
  }

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if(e.key !== 'Escape') return
    e.preventDefault()
    cancel()
  }

  const handleConfirmKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if(e.key !== 'Escape' || isPending) return
    e.preventDefault()
    setMode('edit')
  }

  if(mode === 'confirm') {
    return (
      <div
        role="group"
        aria-labelledby={confirmTitleId}
        onKeyDown={handleConfirmKeyDown}
        className="w-full max-w-xl mb-2 p-4 rounded-lg bg-secondary/50 border border-slate-700 shadow-md shadow-slate-900/50 slide-down
                   sg:bg-white sg:border-sg-sand sg:shadow-sg-ink/5"
      >
        <h3 id={confirmTitleId} className="uppercase tracking-[1.5px] text-sm text-muted">Potvrdi novi nadimak</h3>
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-2xl md:text-3xl font-bold">
          <span className="min-w-0 wrap-anywhere text-slate-500 line-through decoration-2 decoration-slate-600 sg:text-stone-400 sg:decoration-stone-300">
            <span className="sr-only">Stari nadimak: </span>{username}
          </span>
          <svg className="size-6 shrink-0 text-orange-500 sg:text-sg-red" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
          <span className="min-w-0 wrap-anywhere text-white sg:text-sg-ink">
            <span className="sr-only">Novi nadimak: </span>{next}
          </span>
        </p>
        <p className="mt-3 flex items-start gap-2 text-sm text-amber-300 sg:text-amber-700">
          <svg className="size-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          Sledeću promenu nadimka možeš da napraviš tek za {USERNAME_COOLDOWN_DAYS} dana.
        </p>
        <div className="mt-4 flex gap-2">
          <button ref={confirmRef} type="button" onClick={handleConfirm} disabled={isPending} className={primaryButton}>
            {
              isPending &&
                <svg className="size-4 animate-spin motion-reduce:hidden" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
            }
            {isPending ? 'Čuvam…' : 'Potvrdi'}
          </button>
          <button type="button" onClick={() => setMode('edit')} disabled={isPending} className={secondaryButton}>Nazad</button>
        </div>
      </div>
    )
  }

  if(mode === 'edit') {
    const counterColor = next.length > USERNAME_MAX_LENGTH
      ? "text-red-400 sg:text-red-600"
      : next.length >= USERNAME_MAX_LENGTH - 3 ? "text-orange-400 sg:text-amber-600" : "text-muted"

    const isInvalid = error !== null || (next !== '' && !isValid)

    return (
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-xl mb-2 slide-down">
        <label htmlFor={inputId} className="sr-only">Novi nadimak</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 min-w-0">
            <input
              ref={inputRef}
              id={inputId}
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(null) }}
              onKeyDown={handleInputKeyDown}
              maxLength={64}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint="done"
              aria-invalid={isInvalid}
              aria-describedby={error ? `${rulesId} ${errorId}` : rulesId}
              className={`${isInvalid ? "border-red-400/70 focus:border-red-400 focus:ring-red-400/30 sg:border-red-400" : "border-slate-700 focus:border-orange-500 focus:ring-orange-500/30 sg:border-sg-sand sg:focus:border-sg-red sg:focus:ring-sg-red/20"}
                w-full h-14 pl-3 pr-16 rounded-lg bg-secondary border text-2xl md:text-3xl font-bold text-white outline-none focus:ring-4 duration-200
                sg:bg-white sg:text-sg-ink`}
            />
            <span className={`${counterColor} absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold tabular-nums pointer-events-none`} aria-hidden="true">
              {next.length}/{USERNAME_MAX_LENGTH}
            </span>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={!isValid} className={`${primaryButton} sm:h-14`}>Sačuvaj</button>
            <button type="button" onClick={cancel} className={`${secondaryButton} sm:h-14`}>Otkaži</button>
          </div>
        </div>

        <ul id={rulesId} className="mt-2.5 flex flex-col gap-1 text-sm">
          {
            usernameRules.map(rule => {
              const passed = rule.test(next)
              const color = passed
                ? "text-green-400 sg:text-green-700"
                : next === '' ? "text-muted" : "text-red-400 sg:text-red-600"

              return (
                <li key={rule.label} className={`${color} flex items-center gap-2 duration-200`}>
                  <svg className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                    {
                      passed
                        ? <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        : <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    }
                  </svg>
                  {rule.label}
                  <span className="sr-only">{passed ? ', ispunjeno' : ', nije ispunjeno'}</span>
                </li>
              )
            })
          }
        </ul>

        {
          error &&
            <p id={errorId} role="alert" className="mt-2 flex items-start gap-2 text-sm font-semibold text-red-400 sg:text-red-600">
              <svg className="size-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              {error}
            </p>
        }
      </form>
    )
  }

  return (
    <div className="flex items-center gap-1 min-w-0">
      <h2
        ref={headingRef}
        key={highlightKey}
        tabIndex={-1}
        className={`${highlightKey > 0 ? "name-highlight" : ""} min-w-0 font-bold text-4xl text-white break-words outline-none sg:text-sg-ink sg:[--name-glow:var(--color-sg-red)]`}
      >
        {username}
      </h2>
      {
        status?.canChange &&
          <button
            ref={pencilRef}
            type="button"
            onClick={startEditing}
            aria-label="Promeni nadimak"
            title="Promeni nadimak"
            className="shrink-0 size-11 grid place-items-center rounded-lg cursor-pointer duration-200 text-slate-500 hover:text-orange-500 hover:bg-white/5
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500
                       sg:text-stone-400 sg:hover:text-sg-red sg:hover:bg-sg-sand/50 sg:focus-visible:ring-sg-red"
          >
            <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
          </button>
      }
    </div>
  )
}
