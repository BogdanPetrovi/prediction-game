import { z } from 'zod'

export const Page = z.coerce.number().positive()