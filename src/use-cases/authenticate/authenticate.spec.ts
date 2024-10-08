import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { expect, describe, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

/**
 * Tests functionalities of the authenticate use case
 */

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase // sut = system under test

describe('Authenticate Use Case', () => {
  /** Tests if authentication is successful */
  it('Should be able to authenticate', async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository) // sut = system under test

    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@mail.com',
      password_hash: await hash('Abc123!', 6),
    })

    const { user } = await sut.execute({
      email: 'john.doe@mail.com',
      password: 'Abc123!',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  /** Tests if authentication fails with wrong email */
  it('Should not be able to authenticate with wrong email', async () => {
    await expect(async () => {
      await sut.execute({
        email: 'john.doe@mail.com',
        password: 'Abc123!',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  /** Tests if authentication fails with wrong password */
  it('Should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@mail.com',
      password_hash: await hash('Abc123!', 6),
    })

    await expect(async () => {
      await sut.execute({
        email: 'john.doe@mail.com',
        password: 'Cba321@!',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
