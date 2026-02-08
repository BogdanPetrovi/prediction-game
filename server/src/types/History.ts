export default interface History{
  name: string,
  logo: string,
  placements: Placements
}

interface Placements {
  firstPlace?: string,
  secondPlace?: string,
  thirdPlace?: string
}