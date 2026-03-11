import { z } from 'zod'

export const UserType = z.object({
    id: z.number().positive(),
    username: z.string()
})