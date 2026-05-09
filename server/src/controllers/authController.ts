import { Request, Response } from "express";
import posthog from "../config/posthog.js";
import { UserType } from "../schemas/shared.schemas.js";
import redisClient from "../config/redis.js";
import { getIp } from "../utils/getIp.js";

export const getUser = async (req: Request, res: Response) => {
  const user = req.user;
  const { id, username } = UserType.parse(user)

  const sessionKey = `tracked:${id}:${req.sessionID}`
  const alreadyTracked = await redisClient.get(sessionKey)

  if(!alreadyTracked){
    posthog.capture({
      distinctId: String(id),
      event: 'user_active',
      properties: {
        $ip: getIp(req),
        utm_source: req.headers['x-utm-source'] || 'organic',
        username: username
      }
    })
    await redisClient.set(sessionKey, '1', { EX: 3600 })
  }

  return res.status(200).json({
    loggedIn: true,
    user: { id, username }
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