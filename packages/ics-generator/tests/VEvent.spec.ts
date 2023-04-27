import { describe, expect, it } from 'vitest'
import { VEvent } from '../src/VEvent'
import { ICalendar } from '../src/ICalendar'

describe('VEvent Object', () => {
  it('should create an valid empty Event object', () => {
    const given = new VEvent(new ICalendar())

    expect(given.properties).toHaveProperty('UID')
    expect(given.properties).toHaveProperty('DTSTAMP')
  })
})
