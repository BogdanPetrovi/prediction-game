import { z } from 'zod'

export const HistoryPage = z.coerce.number().int().positive().default(1)
