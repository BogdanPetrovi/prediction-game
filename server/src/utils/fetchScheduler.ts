import fetchMatches from "./fetchMatches.js"

const MIN_DELAY = 25 * 60 * 1000
const MAX_DELAY = 35 * 60 * 1000

function getRandomDelay() {
  return Math.floor(
    Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY
  )
}

let schedulerRunning = false

async function runScheduler() {
  try {
    await fetchMatches()
  } catch (err) {
    console.error('Scheduler error:', err)
  }

  const nextDelay = getRandomDelay()

  console.log(
    `Next matches scrape in ${Math.round(
      nextDelay / 60000
    )} minutes`
  )

  setTimeout(runScheduler, nextDelay)
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