import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

/**
 * Tests functionalities of the check in use case
 */

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search gyms use case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('Should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Extreme Go Horse Gym',
      description: null,
      phone: null,
      latitude: -22.9103015,
      longitude: -47.0620756,
    })

    await gymsRepository.create({
      title: 'Clean Code Gym',
      description: null,
      phone: null,
      latitude: -22.9103015,
      longitude: -47.0620756,
    })

    const { gyms } = await sut.execute({
      query: 'Clean',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Clean Code Gym' })])
  })

  it('Should be able to fetch paginated gyms', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Clean Code Gym - ${i}`,
        description: null,
        phone: null,
        latitude: -22.9103015,
        longitude: -47.0620756,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Clean',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Clean Code Gym - 21' }),
      expect.objectContaining({ title: 'Clean Code Gym - 22' }),
    ])
  })
})
