import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'
let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase
describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })
  it('should be able to fetch nearby gyms', async () => {
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
      latitude: -22.8181683,
      longitude: -47.0697822,
    })
    const { gyms } = await sut.execute({
      userLatitude: -22.910556,
      userLongitude: -47.0608552,
    })
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Extreme Go Horse Gym' }),
    ])
  })
})
