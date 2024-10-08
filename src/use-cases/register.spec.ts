import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'

/**
 * Tests functionalities of the register use case
 */
describe('Register Use Case', () => {
  /** Tests if register is successful */
  it('Should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'Jane Doe',
      email: 'jane.doe@mail.com',
      password: 'Abc123!',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  /** Tests if password is hashed */
  it('Should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'Josh Doe',
      email: 'Josh.doe@mail.com',
      password: 'Abc123!',
    })

    const isPasswordCorrectlyHashed = await compare(
      'Abc123!',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  /** Tests if the same email can't be registered twice */
  it('Should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const email = 'john.doe@mail.com'

    await registerUseCase.execute({
      name: 'John Doe',
      email,
      password: 'Abc123!',
    })

    expect(async () => {
      await registerUseCase.execute({
        name: 'John Doe',
        email,
        password: 'Abc123!',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
