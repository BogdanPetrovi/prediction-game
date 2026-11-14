import { z } from 'zod'

export const Username = z.string().min(1)
