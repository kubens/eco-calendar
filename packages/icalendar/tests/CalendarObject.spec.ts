import { beforeEach, describe, expect, it } from 'vitest'
import { CalendarObject } from '../src/CalendarObject'
import { DateTime } from '../src/DateTime'

class TestObject extends CalendarObject {}

describe('CalendarObject', () => {
  let object: CalendarObject

  beforeEach(() => {
    object = new TestObject('VCALENDAR', {
      UID: { required: true, once: true },
      VERSION: { required: true, once: true },
      DESCRIPTION: { required: false, once: false },
    })
  })

  it('should create an empty Object', () => {
    expect(object.properties).toEqual({})
  })

  describe('properties', () => {
    it('should add property', () => {
      object.addProperty('UID', '__UID_VALUE__')

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

    it('should remove property', () => {
      object.addProperty('VERSION', '__VERSION_VALUE__')
      expect(object.properties['VERSION']).toBeTruthy()

      object.removeProperty('VERSION')
      expect(object.properties['VERSION']).toBeFalsy()
    })
  })

  describe('formatter', () => {
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
      object.addProperty('UID', '__UID_VALUE__')
      object.addProperty('VERSION', '__VERSION_VALUE__')
      object.addProperty('DTSTART', new DateTime({ year: 2023, month: 4, day: 8 }))
      object.addProperty(
        'DTSTART',
        new DateTime({ year: 2023, month: 4, day: 8 }, { hours: 20, minutes: 46, seconds: 23 }),
        { VALUE: 'DATE' }
      )

      expect(object.format()).toEqual([
        'BEGIN:VCALENDAR',
        'UID:__UID_VALUE__',
        'VERSION:__VERSION_VALUE__',
        'DTSTART:20230408',
        'DTSTART;VALUE=DATE:20230408T204623Z',
        'END:VCALENDAR',
      ])
    })
  })
})
