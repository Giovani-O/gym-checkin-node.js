export class UserAlreadyExistsError extends Error {
  constructor() {
    super('O email já está em uso.')
  }
}
