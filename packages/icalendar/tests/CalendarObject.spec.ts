import { beforeEach, describe, expect, it } from 'vitest'
import { CalendarObject } from '../src/CalendarObject'
import { CalendarProperty } from '../src/CalendarProperty'
import { DateTime } from '../src/DateTime'

class TestObject extends CalendarObject {}

describe('CalendarObject', () => {
  let object: CalendarObject

  beforeEach(() => {
    object = new TestObject('VCALENDAR')
  })

  it('should create an valid empty Object', () => {
    expect(object.properties).toEqual({})
  })

  it('should add property', () => {
    const given = new CalendarProperty('UID', '__UID_VALUE__')
    object.addProperty(given)

    expect(object.properties).toEqual({
      UID: [
        {
          name: 'UID',
          value: '__UID_VALUE__',
          parameters: {},
        },
      ],
    })
  })

  it('should add property by name and value', () => {
    object.addProperty('SUMMARY', '__SUMMARY__')
    expect(object.properties).toEqual({
      SUMMARY: [
        {
          name: 'SUMMARY',
          value: '__SUMMARY__',
          parameters: {},
        },
      ],
    })
  })

  it('should remove property', () => {
    const given = new CalendarProperty('VERSION', '__VERSION_VALUE__')
    object.addProperty(given)
    expect(object.properties[given.name]).toBeTruthy()

    object.removeProperty(given.name)
    expect(object.properties[given.name]).toBeFalsy()
  })

  it('should formats objects', () => {
    object.addProperty('UID', '__UID_VALUE__')
    object.addProperty('VERSION', '__VERSION_VALUE__')

    expect(object.format()).toEqual([
      'BEGIN:VCALENDAR',
      'UID:__UID_VALUE__',
      'VERSION:__VERSION_VALUE__',
      'END:VCALENDAR',
    ])
  })

  it('should formats objects with multiple occurrences of a property', () => {
    object.addProperty('DTSTART', new DateTime({ year: 2023, month: 4, day: 8 }))
    object.addProperty(
      'DTSTART',
      new DateTime({ year: 2023, month: 4, day: 8 }, { hours: 20, minutes: 46, seconds: 23 }),
      { VALUE: 'DATE' }
    )

    expect(object.format()).toEqual([
      'BEGIN:VCALENDAR',
      'DTSTART:20230408',
      'DTSTART;VALUE=DATE:20230408T204623Z',
      'END:VCALENDAR',
    ])
  })
})
