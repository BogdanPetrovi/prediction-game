import { Request, Response } from "express";
import database from "../database/database.js";
import History from "../types/History.js";
import { HistoryPage } from "../schemas/history.schemas.js";

const PAGE_SIZE = 5

const placementKeys = ['firstPlace', 'secondPlace', 'thirdPlace'] as const

const finishedEventsCte = `finished_events AS (
                             SELECT id, name, logo, start_date FROM events
                             WHERE parent_event_id IS NULL
                               AND is_active = false
                               AND NOT EXISTS (
                                 SELECT 1 FROM events AS child
                                 WHERE child.parent_event_id = events.id
                                   AND child.is_active = true
                               )
                               AND EXISTS (
                                 SELECT 1 FROM leaderboards
                                 WHERE leaderboards.event_id = events.id
                               )
                           )`

export const getHistory = async (req: Request, res: Response) => {
  const page = HistoryPage.parse(req.query.page)
  const offset = (page - 1) * PAGE_SIZE

  const [result, countResult] = await Promise.all([
    database.query(`WITH ${finishedEventsCte},
                    page_events AS (
                      SELECT * FROM finished_events
                      ORDER BY start_date DESC, id DESC
                      LIMIT $1 OFFSET $2
                    ),
                    ranked_leaderboards AS (
                      SELECT page_events.id, page_events.name, page_events.logo, page_events.start_date, users.username,
                        ROW_NUMBER() OVER (PARTITION BY page_events.id ORDER BY leaderboards.points DESC)::int AS rank
                      FROM page_events
                      JOIN leaderboards ON leaderboards.event_id = page_events.id
                      JOIN users ON users.id = leaderboards.user_id
                    )
                    SELECT id, name, logo, username, rank
                    FROM ranked_leaderboards
                    WHERE rank <= 3
                    ORDER BY start_date DESC, id DESC, rank;`, [PAGE_SIZE, offset]),
    database.query(`WITH ${finishedEventsCte} SELECT COUNT(*)::int AS total FROM finished_events;`)
  ])

  const events = new Map<string, History>()

  for(const row of result.rows) {
    const event: History = events.get(row.id) ?? { name: row.name, logo: row.logo, placements: {} }
    event.placements[placementKeys[row.rank - 1]] = row.username
    events.set(row.id, event)
  }

  const total: number = countResult.rows[0].total

  return res.status(200).json({
    events: [...events.values()],
    pages: Math.ceil(total / PAGE_SIZE),
    total,
    pageSize: PAGE_SIZE
  })
}
