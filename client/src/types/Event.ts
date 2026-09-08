export interface Event {
  id?: string,
  name: string,
  logo: string
}

export interface FullEvent extends Event {
  startDate: number,
  endDate: number
}