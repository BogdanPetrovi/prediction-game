import { Request, Response, NextFunction } from "express"
import { UserType } from "../schemas/shared.schemas.js"
import database from "../database/database.js"
import AppError from "../utils/customErrorHandlers/appError.js"

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const parsedUser = UserType.parse(req.user)

    const result = await database.query("SELECT is_admin FROM users WHERE id = $1;", [parsedUser.id])

    if(!result.rows[0].is_admin)
        throw new AppError("You must be admin to access this route!", 403)

    next()
}