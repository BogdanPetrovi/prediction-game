const STORAGE_KEY = 'tabela-strana'

export const parseLeaderboardPage = (value: string | null) => {
  const page = Number(value)
  return Number.isInteger(page) && page > 0 ? page : 1
}

export const leaderboardHref = (page: number) => page > 1 ? `/tabela?strana=${page}` : '/tabela'

export const saveLeaderboardPage = (page: number) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, String(page))
  } catch {}
}

export const getSavedLeaderboardHref = () => {
  try {
    return leaderboardHref(parseLeaderboardPage(sessionStorage.getItem(STORAGE_KEY)))
  } catch {
    return '/tabela'
  }
}
