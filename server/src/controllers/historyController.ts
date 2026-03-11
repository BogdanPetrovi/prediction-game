import { Request, Response } from "express";
import database from "../database/database.js";
import History from "../types/History.js";

export const getHistory = async (req: Request, res: Response) => {
  const result = await database.query(`WITH finished_events AS (
                                        SELECT id FROM events
                                        WHERE parent_event_id IS NULL
                                          AND is_active = false
                                          AND NOT EXISTS (
                                            SELECT 1 FROM events AS child
                                            WHERE child.parent_event_id = events.id
                                              AND child.is_active = true
                                          )
                                      ),
                                      RankedLeaderboards AS (
                                        SELECT users.username, events.name, events.logo, events.id, events.start_date AS date,
                                          ROW_NUMBER() OVER (PARTITION BY events.id ORDER BY leaderboards.points DESC) AS rank
                                        FROM leaderboards
                                        JOIN users ON leaderboards.user_id = users.id
                                        JOIN events ON leaderboards.event_id = events.id
                                        WHERE events.id IN (SELECT id FROM finished_events) AND events.parent_event_id IS NULL
                                      )
                                      SELECT username, name, logo, id, rank
                                      FROM RankedLeaderboards
                                      WHERE rank <= 3
                                      ORDER BY date DESC;`);

  const arrayOfEventsWithRanking = result.rows.reduce((accumulator: History[], current) => {
    const eventIndex = accumulator.findIndex(event => event.name === current.name)

    if(eventIndex >= 0){
      if(current.rank === '1'){
        accumulator[eventIndex].placements.firstPlace = current.username
      } else if(current.rank === '2') {
        accumulator[eventIndex].placements.secondPlace = current.username
      } else {
        accumulator[eventIndex].placements.thirdPlace = current.username
      }

    } else {
      accumulator.push({
      name: current.name,
      logo: current.logo,
      placements: current.rank === '1' ? 
                    { firstPlace: current.username } : 
                  current.rank === '2' ? 
                    { secondPlace: current.username } : 
                  { thirdPlace: current.username }
      })
    }

    return accumulator
  }, [])

  return res.status(200).json(arrayOfEventsWithRanking)
}