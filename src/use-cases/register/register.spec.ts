import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '../_errors/user-already-exists-error'
import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'

/**
 * Tests functionalities of the register use case
 */

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase
describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  /** Tests if register is successful */
  it('Should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'Jane Doe',
      email: 'jane.doe@mail.com',
      password: 'Abc123!',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  /** Tests if password is hashed */
  it('Should hash user password upon registration', async () => {
    const { user } = await sut.execute({
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
    const email = 'john.doe@mail.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: 'Abc123!',
    })

    // Sempre que houver uma promise dentro do expect, usar await
    await expect(async () => {
      await sut.execute({
        name: 'John Doe',
        email,
        password: 'Abc123!',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
