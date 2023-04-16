import { describe, expect, it } from 'vitest'
import { ICalendar } from '../src/ICalendar'
import { Duration } from '../src/Duration'

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

  it('should set properties for setTTL', () => {
    const given = new ICalendar()
    const duration = new Duration({ days: 7 })

    given.setTTL(duration)

    expect(given.format()).toEqual([
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID://kubens.com//icalendar',
      'REFRESH-INTERVAL;VALUE=DURATION:P7D',
      'X-PUBLISHED-TTL:P7D',
      'END:VCALENDAR',
    ])
  })
})
