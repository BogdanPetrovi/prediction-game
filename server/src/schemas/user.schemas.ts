import { z } from 'zod'

export const Username = z.string().min(1)

export const ChangeUsernameBody = z.object({
  username: z.string()
    .normalize('NFKC')
    .trim()
    .min(3, 'Nadimak mora imati bar 3 karaktera')
    .max(28, 'Nadimak može imati najviše 28 karaktera')
    .regex(/^[\p{L}\p{N}_.-]+( [\p{L}\p{N}_.-]+)*$/u, 'Nadimak može sadržati samo slova, brojeve, razmake između reči i znakove _ . -')
    .regex(/[\p{L}\p{N}]/u, 'Nadimak mora sadržati bar jedno slovo ili broj')
})
