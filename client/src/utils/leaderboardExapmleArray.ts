import LeaderboardItem from "@/types/leaderboardItem"

// this will be on backend but have to make it working now
export const leaderboardCut = ( page: number ): Array<LeaderboardItem> => {
  const lastItem = page * 10 ;
  const firstItem = lastItem - 10;
  const newArr = leaderboardExampleArray.slice( firstItem, lastItem )
  return newArr
}

const leaderboardExampleArray: Array<LeaderboardItem> = [
  {
    username: "Svojke",
    points: 23
  },
  {
    username: "Matke",
    points: 22
  },
  {
    username: "StelaLimes",
    points: 22
  },
  {
    username: "Luka",
    points: 22
  },
  {
    username: "Tike",
    points: 20
  },
  {
    username: "pitschweiz",
    points: 19
  },
  {
    username: "Zona",
    points: 17
  },
  {
    username: "Gibo",
    points: 15
  },
  {
    username: "mareliiii",
    points: 15
  },
  {
    username: "Kalu17",
    points: 14
  },
  {
    username: "DrRistic",
    points: 13
  },
  {
    username: "Vlasta",
    points: 12
  },
  {
    username: "RaGe",
    points: 11
  },
  {
    username: "Josip",
    points: 10
  },
  {
    username: "Slavces",
    points: 10
  },
  {
    username: "Buco",
    points: 10
  },
  {
    username: "vaceMK",
    points: 8
  },
  {
    username: "Xental",
    points: 6
  },
  {
    username: "C4ne",
    points: 2
  },
  {
    username: "1",
    points: 0
  },
  {
    username: "2",
    points: 0
  },
  {
    username: "3",
    points: 0
  },
  {
    username: "4",
    points: 0
  },
  {
    username: "5",
    points: 0
  },
  {
    username: "6",
    points: 0
  }

]

export default leaderboardExampleArray