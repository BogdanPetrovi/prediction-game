import Match from "../types/Match.js"
import { MIN_EVENT_ID } from "../schemas/admin.schemas.js"
import AppError from "./customErrorHandlers/appError.js"

const API_URL = "https://api.pandascore.co"
const PER_PAGE = 100
const COUNTERSITE_LOGO = "https://countersite.gg/svojkellogonobg.png"
const IGNORED_SEARCH_WORDS = ["season", "stage"]

interface ApiTeam {
  id: number,
  name: string,
  image_url: string | null
}

interface ApiMatch {
  id: number,
  status: 'not_started' | 'running' | 'finished' | 'canceled' | 'postponed',
  scheduled_at: string | null,
  number_of_games: number,
  serie_id: number,
  forfeit: boolean,
  winner_id: number | null,
  opponents: { opponent: ApiTeam }[],
  results: { team_id: number, score: number }[]
}

interface ApiSerie {
  id: number,
  name: string | null,
  full_name: string,
  season: string | null,
  year: number,
  slug: string,
  begin_at: string,
  end_at: string,
  league: { name: string, image_url: string | null }
}

export interface MatchResult {
  id: number,
  team1: { name: string, score: number },
  team2: { name: string, score: number }
}

const request = async <T>(path: string, params: Record<string, string>) => {
  const url = new URL(path, API_URL)
  url.search = new URLSearchParams(params).toString()

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.PANDASCORE_TOKEN}` }
  })
  console.log(`PandaScore ${path} responded with ${response.status}, remaining requests: ${response.headers.get('x-rate-limit-remaining')}`)

  if(response.status === 429)
    throw new AppError(`PandaScore rate limit reached, retry after ${response.headers.get('retry-after')}s`, 429)
  if(!response.ok)
    throw new AppError(`PandaScore responded with status ${response.status}`, 502)

  return { data: await response.json() as T, total: Number(response.headers.get('x-total')) }
}

const requestAll = async <T>(path: string, params: Record<string, string>): Promise<T[]> => {
  const items: T[] = []

  for(let page = 1; ; page++) {
    const { data, total } = await request<T[]>(path, { ...params, per_page: String(PER_PAGE), page: String(page) })
    items.push(...data)

    if(data.length < PER_PAGE || items.length >= total)
      return items
  }
}

const toWords = (text: string) => text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").split(/[^a-z0-9]+/).filter(Boolean)

const eventName = (serie: ApiSerie) => {
  const league = serie.league.name
  const name = serie.name?.trim()

  let fullName = `${league} ${serie.full_name}`
  if(serie.season && /^\d+$/.test(serie.season))
    fullName = `${league} ${name ?? ''} Season ${serie.season}`
  else if(name)
    fullName = `${league} ${name} ${serie.year}`

  return fullName.replace(/\s+/g, ' ').trim().slice(0, 100)
}

export const findEvent = async (query: string) => {
  const words = toWords(query).filter(word => !IGNORED_SEARCH_WORDS.includes(word))
  if(words.length === 0)
    throw new AppError("Search query needs at least one word besides season and stage", 400)

  const { data: series } = await request<ApiSerie[]>('/csgo/series', {
    'search[slug]': words[0],
    sort: '-begin_at',
    per_page: '50'
  })

  let best: { serie: ApiSerie, score: number } | null = null
  for(const serie of series.filter(serie => serie.id >= MIN_EVENT_ID)) {
    const serieWords = new Set(toWords(`${serie.league.name} ${serie.full_name} ${serie.slug}`))
    const score = words.filter(word => serieWords.has(word)).length
    if(score > (best?.score ?? 0))
      best = { serie, score }
  }

  if(!best)
    throw new AppError(`No event found for "${query}"`, 404)

  return {
    id: best.serie.id,
    logo: best.serie.league.image_url ?? COUNTERSITE_LOGO,
    name: eventName(best.serie),
    startDate: Date.parse(best.serie.begin_at),
    endDate: Date.parse(best.serie.end_at)
  }
}

export const getMatches = async (serieId: number): Promise<Match[]> => {
  const matches = await requestAll<ApiMatch>('/csgo/matches', {
    'filter[serie_id]': String(serieId),
    'filter[status]': 'not_started,running',
    'filter[opponents_filled]': 'true',
    sort: 'scheduled_at'
  })

  return matches
    .filter((match): match is ApiMatch & { scheduled_at: string } => match.opponents.length === 2 && match.scheduled_at !== null)
    .map((match) => {
      const [team1, team2] = match.opponents.map(({ opponent }) => ({
        id: opponent.id,
        name: opponent.name,
        logo: opponent.image_url ?? ''
      }))

      return {
        id: match.id,
        date: Date.parse(match.scheduled_at),
        team1,
        team2,
        format: `bo${match.number_of_games}`,
        event: { id: match.serie_id },
        live: match.status === 'running'
      }
    })
}

export const getResults = async (serieId: number): Promise<MatchResult[]> => {
  const matches = await requestAll<ApiMatch>('/csgo/matches', {
    'filter[serie_id]': String(serieId),
    'filter[status]': 'finished,canceled'
  })

  return matches.flatMap((match) => {
    const isForfeit = match.forfeit && match.winner_id !== null
    if(match.opponents.length !== 2 || match.winner_id === null || (match.status === 'canceled' && !isForfeit))
      return []

    const [team1, team2] = match.opponents.map(({ opponent }) => ({
      id: opponent.id,
      name: opponent.name,
      score: match.results.find(result => result.team_id === opponent.id)?.score ?? 0
    }))

    if(isForfeit && team1.score === 0 && team2.score === 0) {
      team1.score = team1.id === match.winner_id ? 1 : 0
      team2.score = team2.id === match.winner_id ? 1 : 0
    }

    const winner = [team1, team2].find(team => team.id === match.winner_id)
    const loser = winner === team1 ? team2 : team1
    if(!winner || winner.score <= loser.score) {
      console.log(`Skipping PandaScore result for match ${match.id}: winner and score ${team1.score}:${team2.score} don't match`)
      return []
    }

    return [{
      id: match.id,
      team1: { name: team1.name, score: team1.score },
      team2: { name: team2.name, score: team2.score }
    }]
  })
}
