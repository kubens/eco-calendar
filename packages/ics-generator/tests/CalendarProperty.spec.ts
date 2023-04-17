import { describe, expect, it } from 'vitest'
import { CalendarProperty } from '../src/CalendarProperty'
import { Duration } from '../src/Duration'

describe('CalendarProperty', () => {
  it('should create an valid object', () => {
    const given = new CalendarProperty('UID', '__UID_VALUE__')

    expect(given.name).toBe('UID')
    expect(given.value).toBe('__UID_VALUE__')
    expect(given.parameters).toEqual({})
  })

  it('should set parameter', () => {
    const duration = new Duration({ days: 7 })
    const given = new CalendarProperty('DTSTART', duration.toString(), {
      VALUE: 'DURATION',
    })

    expect(given.parameters).toEqual({
      VALUE: 'DURATION',
    })
  })

  it('should format line', () => {
    const given = new CalendarProperty('SUMMARY', '__SUMMARY_VALUE__')
    expect(given.format()).toEqual(['SUMMARY:__SUMMARY_VALUE__'])
  })

  it('should format array of string', () => {
    const given = new CalendarProperty('CATEGORIES', ['__FIRST__', '__SECOND__'])
    expect(given.format()).toEqual(['CATEGORIES:__FIRST__,__SECOND__'])
  })

  it('should wraps line', () => {
    const value =
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod ' +
      'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, ' +
      'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

    const given = new CalendarProperty('SUMMARY', value)

    expect(given.format()).toEqual([
      `SUMMARY:Lorem ipsum dolor sit amet\\, consectetur adipisicing elit\\, sed do`,
      ' eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad',
      ' minim veniam\\, quis nostrud exercitation ullamco laboris nisi ut aliquip',
      ' ex ea commodo consequat.',
    ])
  })

  it('should format with parameters', () => {
    const duration = new Duration({ days: 2 })
    const given = new CalendarProperty('DTSTART', duration.toString(), {
      VALUE: 'DURATION',
    })

    expect(given.format()).toEqual(['DTSTART;VALUE=DURATION:P2D'])
  })
})
