import { Request } from 'express'

export const getCountry = (req: Request) => {
  const country = req.headers['x-client-country']
  return typeof country === 'string' && /^[A-Z]{2}$/.test(country) ? country : undefined
}
