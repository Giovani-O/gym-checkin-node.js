export class MaxNumberOfCheckInsError extends Error {
  constructor() {
    super('You cannot check in again today, try tomorrow.')
  }
}
