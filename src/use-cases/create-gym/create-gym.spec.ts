import { expect, describe, it, beforeEach } from 'vitest'
import { CreateGymUseCase } from './create-gym'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

/**
 * Tests functionalities of the register use case
 */

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase
describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  /** Tests if gym creation is successful */
  it('Should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Extreme Go Horse Gym',
      description: null,
      phone: null,
      latitude: -22.9103015,
      longitude: -47.0620756,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
