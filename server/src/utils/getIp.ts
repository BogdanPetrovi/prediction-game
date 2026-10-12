import { Request } from 'express'

const firstValue = (header: string | string[] | undefined) =>
  (Array.isArray(header) ? header[0] : header)?.split(',')[0].trim()

export const getIp = (req: Request) =>
  firstValue(req.headers['x-client-ip']) ||
  firstValue(req.headers['cf-connecting-ip']) ||
  firstValue(req.headers['x-forwarded-for']) ||
  req.socket.remoteAddress
