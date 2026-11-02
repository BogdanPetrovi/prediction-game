import fetchMatches from "./fetchMatches.js"
import formatDateAndTime from "./formatDateAndTime.js"

const MIN_DELAY = 25 * 60 * 1000
const MAX_DELAY = 35 * 60 * 1000

function getRandomDelay() {
  return Math.floor(
    Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY
  )
}

let schedulerRunning = false
let nextFetch: NodeJS.Timeout | undefined
let fetchQueue = Promise.resolve()

function runScheduler() {
  clearTimeout(nextFetch)

  fetchQueue = fetchQueue.then(async () => {
    try {
      await fetchMatches()
    } catch (err) {
      console.error(`[${formatDateAndTime()}]Scheduler error: ${ err }`)
    }

    const nextDelay = getRandomDelay()

    console.log(
      `Next matches fetch in ${Math.round(
        nextDelay / 60000
      )} minutes, at ${ formatDateAndTime(new Date(Date.now() + nextDelay)) }`
    )

    clearTimeout(nextFetch)
    nextFetch = setTimeout(runScheduler, nextDelay)
  })

  return fetchQueue
}

export function fetchMatchesNow() {
  return runScheduler()
}

export function startMatchesScheduler() {
  if (schedulerRunning) {
    console.log('Matches scheduler already running')
    return
  }

  schedulerRunning = true

  console.log('Starting matches scheduler...')

  runScheduler()
}
