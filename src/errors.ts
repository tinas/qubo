export class QuboError extends Error {
  constructor(message: string) {
    super(`[qubo] ${message}`)
    this.name = 'QuboError'
  }
}
