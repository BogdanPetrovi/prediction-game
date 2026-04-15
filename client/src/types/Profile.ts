export default interface Profile {
  username: string,
  form: boolean[],
  streak: Streak,
  stats: Stats 
}

interface Streak {
  count: number,
  type: 'win' | 'loss'
}

interface Stats {
  successRate: number,
  total: number,
  correct: number,
  incorrect: number
}