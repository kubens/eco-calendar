import { describe, expect, it } from 'vitest'
import { Calendar } from '../src/Calendar'

describe('Calendar Object', () => {
  it('should create an valid empty Calendar object', () => {
    const given = new Calendar()

    expect(given.format()).toEqual([
      // prettier-ignore
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      `PRODID://kubens.com//icalendar`,
      'END:VCALENDAR',
    ])
  })
})
