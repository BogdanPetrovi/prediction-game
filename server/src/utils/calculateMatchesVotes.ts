import database from "../database/database.js"
import Match from "../types/Match.js"

const calculateMatchesVotes = async (matches: Match[]) => {
  return Promise.all(
    matches.map(async (match: Match) => {
      const result = await database.query(`SELECT predicted_winner, COUNT(*) AS votes
                                            FROM predictions
                                            WHERE match_id = $1
                                            GROUP BY predicted_winner;`, [match.id])

      if(result.rows.length === 0)
        return { id: Number(match.id), team1: 0, team2: 0 }

      if(result.rows.length === 1){
        return {
          id: Number(match.id),
          team1: result.rows[0].predicted_winner === 'team1' ? 100 : 0,
          team2: result.rows[0].predicted_winner === 'team2' ? 100 : 0
        }
      }
      
      const allVotes = Number(result.rows[0].votes) + Number(result.rows[1].votes)
      const precentageTeam1 = result.rows[0].predicted_winner === 'team1' ? ( (result.rows[0].votes / allVotes) * 100 ) : ( (result.rows[1].votes / allVotes) * 100 )

      return {
        id: Number(match.id),
        team1: Number(precentageTeam1.toFixed(1)),
        team2: Number((100 - precentageTeam1).toFixed(1))
      }
    })
  )
}

export default calculateMatchesVotes