import { Request, Response } from "express";

export const getUser = (req: Request, res: Response) => {
  return res.status(200).json({
    loggedIn: true,
    user: req.user
  });
}

export const logOut = (req: Request, res: Response) => {
  req.logout((err) => {
    if(err) return res.status(500).json(err)
    
    req.session.destroy(err => {
      console.log(err)
    });
    return res.clearCookie('connect.sid').status(200).json({ loggedIn: false })
  })
}