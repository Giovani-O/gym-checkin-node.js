import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from '../_errors/resource-not-found-error'

/**
 * Tests functionalities of the get-user-profile use case
 */

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase // sut = system under test

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  /** Tests if user profile can be obtained */
  it('Should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@mail.com',
      password_hash: await hash('Abc123!', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual(expect.any(String))
  })

  /** Tests if authentication fails with wrong email */
  it('Should not be able to get user profile with wrong id', async () => {
    await expect(async () => {
      await sut.execute({
        userId: 'non-existent-user-id',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
