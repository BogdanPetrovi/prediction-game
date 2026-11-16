export default interface UsernameStatus {
  username: string,
  canChange: boolean,
  nextChangeAt: string | null
}
