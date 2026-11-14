import database from "../database/database.js";
import AppError from "./customErrorHandlers/appError.js";

export default async function findUserByUsername(username: string): Promise<{ id: number, username: string }> {
  const { rows: [user] } = await database.query(
    `SELECT id, username FROM users
      WHERE LOWER(username) = LOWER($1)
      ORDER BY username = $1 DESC, id ASC
      LIMIT 1;`,
    [username]
  );

  if (!user) throw new AppError('Korisnik ne postoji', 404)

  return { id: user.id, username: user.username }
}
