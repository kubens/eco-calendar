import { describe, expect, it } from 'vitest'
import { ICalendar } from '../src/ICalendar'

describe('Calendar Object', () => {
  it('should create an valid empty Calendar object', () => {
    const given = new ICalendar()

    expect(given.format()).toEqual([
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      `PRODID://kubens.com//icalendar`,
      'END:VCALENDAR',
    ])
  })
})
