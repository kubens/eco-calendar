import { describe, expect, it } from 'vitest'
import { Duration } from '../src/Duration'

describe('Duration model', () => {
  it('should return PT0S string for empty duration', () => {
    const given = new Duration()
    expect(given.toString()).toBe('PT0S')
  })

  it('should return P1Y string for 1 year', () => {
    const given = new Duration({ years: 1 })
    expect(given.toString()).toBe('P1Y')
  })

  it('should return P1YT2H string for 1 year and 2 hours', () => {
    const given = new Duration({ years: 1, hours: 2 })
    expect(given.toString()).toBe('P1YT2H')
  })

  it('should return PT12H string for 12 hours', () => {
    const given = new Duration({ hours: 12 })
    expect(given.toString()).toBe('PT12H')
  })

  it('should return P1Y2M3DT4H5M6S string for all attributes', () => {
    const given = new Duration({ years: 1, months: 2, days: 3, hours: 4, minutes: 5, seconds: 6 })
    expect(given.toString()).toBe('P1Y2M3DT4H5M6S')
  })

  it('should return -P1Y2M3DT4H5M6S string for all attributes and isNegative', () => {
    const given = new Duration({ isNegative: true, years: 1, months: 2, days: 3, hours: 4, minutes: 5, seconds: 6 })
    expect(given.toString()).toBe('-P1Y2M3DT4H5M6S')
  })

  describe('when initialing from static seconds', () => {
    it('should return PT1M string for 60 seconds', () => {
      const given = Duration.seconds(60)
      expect(given.toString()).toBe('PT1M')
    })

    it('should return -PT1M string for -60 seconds', () => {
      const given = Duration.seconds(-60)
      expect(given.toString()).toBe('-PT1M')
    })

    it('should return P1Y8M30DT3H30M50S string for 55_224_666 seconds', () => {
      const given = Duration.seconds(55_224_666)
      expect(given.toString()).toBe('P1Y8M30DT3H30M50S')
    })
  })
})
