import { randomUUID } from "crypto"
import { Request, Response, NextFunction } from "express"
import posthog from "../config/posthog.js"

const captureAnonymous = (event: string, properties?: Record<string, string>) => {
  posthog.capture({
    distinctId: randomUUID(),
    event,
    properties: { ...properties, $process_person_profile: false }
  })
}

export const trackLoginStarted = (req: Request, res: Response, next: NextFunction) => {
  captureAnonymous('login_started')
  next()
}

export const trackLoginFailed = (req: Request, res: Response, next: NextFunction) => {
  const { error } = req.query
  if(error !== undefined)
    captureAnonymous('login_failed', {
      reason: typeof error === 'string' && /^[a-z_]{1,50}$/.test(error) ? error : 'unknown'
    })

  next()
}
