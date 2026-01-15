import { Request, Response, NextFunction } from "express"

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if(!req.user)
    return res.status(401).json({ loggedIn: false })

  next()
}

export default isLoggedIn