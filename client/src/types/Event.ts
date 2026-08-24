export interface Event {
  name: string,
  logo: string
}

export interface FullEvent extends Event {
  id: number,
  startDate: number,
  endDate: number
}