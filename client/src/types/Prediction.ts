import PredictedTeamEnum from "./PredictedTeamEnum";

export default interface Prediction {
  matchId: number,
  predictedTeam: PredictedTeamEnum
}
