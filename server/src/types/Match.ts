export default interface Match {
  id: number,
  // if match is live there is no date
  date?: number,
  team1: Team,
  team2: Team,
  format: string,
  event: Event,
  live: boolean 
}

interface Team {
  id?: number,
  name: string,
  logo: string
}

interface Event {
  id: number
}
