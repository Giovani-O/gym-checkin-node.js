import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from '../_errors/max-number-of-check-ins-error'
import { MaxDistanceError } from '../_errors/max-distance-error'

/**
 * Tests functionalities of the check in use case
 */

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Extreme Go Horse Gym',
      description: '',
      phone: '',
      latitude: -22.9103015,
      longitude: -47.0620756,
    })

    // Mock dates
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  /** Tests if register is successful */
  it('Should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.9103015,
      userLongitude: -47.0620756,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  /** Tests if can't check in twice on the same day */
  it('Should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.9103015,
      userLongitude: -47.0620756,
    })

    await expect(
      async () =>
        await sut.execute({
          gymId: 'gym-01',
          userId: 'user-01',
          userLatitude: -22.9103015,
          userLongitude: -47.0620756,
        }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  /** Tests if can check in on different days */
  it('Should be able to check in twice but on different days', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.9103015,
      userLongitude: -47.0620756,
    })

    vi.setSystemTime(new Date(2024, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.9103015,
      userLongitude: -47.0620756,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  /** Tests if register is successful */
  it('Should not be able to check in on a distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Extreme Go Horse Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-22.9103015),
      longitude: new Decimal(-47.0620756),
    })

    await expect(async () => {
      await sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -22.8181683,
        userLongitude: -47.0697822,
      })
    }).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
