interface Event {
  name: string,
  logo: string
}

interface FullEvent extends Event {
  id: number,
  startDate: number,
  endDate: number
}