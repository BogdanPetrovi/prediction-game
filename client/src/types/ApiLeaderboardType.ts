import LeaderboardItem from "./LeaderboardItem";

export default interface apiLeaderboardType {
  pages: number,
  leaderboard: Array<LeaderboardItem>
}