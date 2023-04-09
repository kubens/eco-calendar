import { describe, expect, it } from 'vitest'
import { DateAttributes, DateTime, TimeAttributes } from '../src/DateTime'

describe('DateTime Model', () => {
  it('should create instance from JS Date', () => {
    const date = new Date(1680804935000)
    const given = DateTime.fromDate(date)

    expect(given).toBeInstanceOf(DateTime)
    expect(given.toString()).toBe('20230406T201535Z')
  })

  it('should return date with time string', () => {
    const date: DateAttributes = { year: 2023, month: 4, day: 6 }
    const time: TimeAttributes = { hours: 18, minutes: 30, seconds: 5 }
    const given = new DateTime(date, time)

    expect(given.toString()).toBe('20230406T183005Z')
  })

  it('should return proper date string', () => {
    const given = new DateTime({ year: 2023, month: 4, day: 6 })
    expect(given.toString()).toBe('20230406')
  })
})
