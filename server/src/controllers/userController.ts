import { Request, Response } from "express";
import { DatabaseError } from "pg";
import { UserType } from "../schemas/shared.schemas.js";
import database from "../database/database.js";
import findUserByUsername from "../utils/findUserByUsername.js";
import findUserById from "../utils/findUserById.js";
import formatDateAndTime from "../utils/formatDateAndTime.js";
import AppError from "../utils/customErrorHandlers/appError.js";
import { ChangeUsernameBody, Username } from "../schemas/user.schemas.js";

const USERNAME_CHANGE_COOLDOWN = '7 days'

const USERNAME_STATUS_QUERY = `SELECT username,
    CASE WHEN username_changed_at + $2::interval > NOW()
      THEN username_changed_at + $2::interval
    END AS next_change_at
  FROM users
  WHERE id = $1`

type UsernameRow = { username: string, next_change_at: Date | null }

const toUsernameStatus = ({ username, next_change_at }: UsernameRow) => ({
  username,
  canChange: next_change_at === null,
  nextChangeAt: next_change_at
})

export const getProfile = async (req: Request, res: Response) => {
  const { id, username } = await findUserById(UserType.parse(req.user).id)
  return res.json(await buildProfile(id, username))
}

export const getUsername = async (req: Request, res: Response) => {
  const { id } = UserType.parse(req.user)

  const { rows: [user] } = await database.query(`${USERNAME_STATUS_QUERY};`, [id, USERNAME_CHANGE_COOLDOWN])
  if (!user) throw new AppError('Korisnik ne postoji', 404)

  return res.json(toUsernameStatus(user))
}

export const changeUsername = async (req: Request, res: Response) => {
  const { id } = UserType.parse(req.user)
  const { username } = ChangeUsernameBody.parse(req.body)

  const user: UsernameRow = await database.transaction(async client => {
    const { rows: [current] } = await client.query(`${USERNAME_STATUS_QUERY} FOR UPDATE;`, [id, USERNAME_CHANGE_COOLDOWN])
    if (!current) throw new AppError('Korisnik ne postoji', 404)

    if (current.username === username) return current

    if (current.next_change_at)
      throw new AppError(`Nadimak možeš ponovo da promeniš od ${formatDateAndTime(current.next_change_at)}`, 429)

    const { rows: [taken] } = await client.query(
      `SELECT 1 FROM users WHERE LOWER(username) = LOWER($1) AND id <> $2;`,
      [username, id]
    )
    if (taken) throw new AppError('Nadimak je zauzet', 409)

    const { rows: [updated] } = await client.query(
      `UPDATE users SET username = $1, username_changed_at = NOW()
        WHERE id = $2
        RETURNING username, username_changed_at + $3::interval AS next_change_at;`,
      [username, id, USERNAME_CHANGE_COOLDOWN]
    ).catch((err: unknown) => {
      if (err instanceof DatabaseError && err.code === '23505') throw new AppError('Nadimak je zauzet', 409)
      throw err
    })

    return updated
  })

  return res.json(toUsernameStatus(user))
}

export const getUserProfile = async (req: Request, res: Response) => {
  const { id, username } = await findUserByUsername(Username.parse(req.params.username))
  return res.json(await buildProfile(id, username))
}

const buildProfile = async (id: number, username: string) => {
  const { rows: [stats] } = await database.query(
    `WITH user_events AS (
      SELECT e.id FROM events e
      JOIN matches ON matches.event_id = e.id
      JOIN predictions ON predictions.match_id = matches.id
      WHERE predictions.user_id = $1 
      GROUP BY e.id
      ORDER BY e.start_date DESC LIMIT 2
    ),
    recent_form AS (
      SELECT p2.predicted_winner = m2.winner_team AS is_correct
      FROM predictions p2
      JOIN matches m2 ON p2.match_id = m2.id
      JOIN user_events ue ON ue.id = m2.event_id 
      WHERE p2.user_id = $1
        AND m2.winner_team IS NOT NULL
      ORDER BY COALESCE(m2.date, EXTRACT(EPOCH FROM m2.created_at::timestamptz) * 1000) DESC
      LIMIT 5
    )
    SELECT
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE p.predicted_winner = m.winner_team) AS correct,
      COUNT(*) FILTER (WHERE p.predicted_winner != m.winner_team) AS incorrect,
      ARRAY(SELECT is_correct FROM recent_form) AS form
    FROM predictions p
    JOIN matches m ON p.match_id = m.id
    WHERE p.user_id = $1 
      AND m.winner_team IS NOT NULL;`,
    [id]
  );

  const total = parseInt(stats.total)
  const correct = parseInt(stats.correct)
  const incorrect = parseInt(stats.incorrect)
  const form = stats.form

  const streakQuery = await database.query(
    `SELECT p.predicted_winner = m.winner_team AS hit
      FROM predictions p
      JOIN matches m ON p.match_id = m.id
      WHERE p.user_id = $1 AND m.winner_team IS NOT NULL
      ORDER BY COALESCE(m.date, EXTRACT(EPOCH FROM m.created_at::timestamptz) * 1000) DESC
      LIMIT 120;`,
    [id]
  );

  let streak = 0;
  let streakType = null;
  for (const { hit } of streakQuery.rows) {
    if (streakType === null) {
      streakType = hit ? 'win' : 'loss';
      streak = 1;
    } else if ((streakType === 'win') === hit) {
      streak++;
    } else {
      break;
    }
  }

  return {
    username: username,
    form,
    streak: { count: streak, type: streakType },
    stats: {
      successRate: total > 0 ? parseFloat(((correct / total) * 100).toFixed(1)) : 0,
      total,
      correct,
      incorrect,
    },
  };
}