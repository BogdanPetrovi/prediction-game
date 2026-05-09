import { Request } from 'express'

export const getIp = (req: Request) => 
  req.headers['cf-connecting-ip'] || 
  req.headers['x-forwarded-for'] || 
  req.socket.remoteAddress