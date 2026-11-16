export const USERNAME_MIN_LENGTH = 3
export const USERNAME_MAX_LENGTH = 28
export const USERNAME_COOLDOWN_DAYS = 7

export const normalizeUsername = (value: string) => value.normalize('NFKC').trim()

export const usernameRules = [
  {
    label: `${USERNAME_MIN_LENGTH}–${USERNAME_MAX_LENGTH} karaktera`,
    test: (username: string) => username.length >= USERNAME_MIN_LENGTH && username.length <= USERNAME_MAX_LENGTH
  },
  {
    label: 'Slova, brojevi, _ . - i po jedan razmak između reči',
    test: (username: string) => /^[\p{L}\p{N}_.-]+( [\p{L}\p{N}_.-]+)*$/u.test(username)
  },
  {
    label: 'Bar jedno slovo ili broj',
    test: (username: string) => /[\p{L}\p{N}]/u.test(username)
  }
]

export const isValidUsername = (username: string) => usernameRules.every(rule => rule.test(username))
