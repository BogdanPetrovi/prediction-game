import database from "../database/database.js";
import AppError from "./customErrorHandlers/appError.js";

export default async function findUserById(id: number): Promise<{ id: number, username: string }> {
  const { rows: [user] } = await database.query(
    `SELECT id, username FROM users WHERE id = $1;`,
    [id]
  );

  if (!user) throw new AppError('Korisnik ne postoji', 404)

  return { id: user.id, username: user.username }
}
