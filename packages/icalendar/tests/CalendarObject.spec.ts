import { describe, expect, it } from 'vitest'
import { CalendarObject } from '../src/CalendarObject'

describe('CalendarObject', () => {
  class TestObject extends CalendarObject {}

  it('should initialize with empty properties when created', () => {
    const object = new TestObject('VCALENDAR', { TEST: { required: false } })
    expect(object.properties).toEqual({})
  })

  it('should add a property with its name and value', () => {
    const object = new TestObject('VCALENDAR', { TEST: { required: false } })
    object.addProperty('TEST', '__TEST_VALUE__')

    expect(object.properties).toEqual({
      TEST: [
        {
          name: 'TEST',
          value: '__TEST_VALUE__',
          parameters: {},
        },
      ],
    })
  })

  it('should remove a previously added property by its name', () => {
    const object = new TestObject('VCALENDAR', { TEST: { required: false } })
    object.addProperty('TEST', '__TEST_VALUE__')
    expect(object.properties['TEST']).toBeTruthy()

    object.removeProperty('TEST')
    expect(object.properties['TEST']).toBeUndefined()
  })

  it('should throw an error when an excluded property is added along with another property', () => {
    const object = new TestObject('VCALENDAR', {
      FIRST: { required: false },
      SECOND: { required: false, excludedBy: ['FIRST'] },
    })

    object.addProperty('FIRST', '__FIRST_VALUE__')
    object.addProperty('SECOND', '__SECOND_VALUE__')

    expect(() => object.validate()).toThrowError('SECOND property should not occur with FIRST')
  })

  it('should throw an error when an excluded is an func and property is excluded by another property', () => {
    const excludedBy = () => ['FIRST']
    const object = new TestObject('VCALENDAR', {
      FIRST: { required: true },
      SECOND: { required: true, excludedBy },
    })

    object.addProperty('FIRST', '__FIRST_VALUE__')
    object.addProperty('SECOND', '__SECOND_VALUE__')

    expect(() => object.validate()).toThrowError('SECOND property should not occur with FIRST')
  })

  it('should throw an error when a required property is missing', () => {
    const object = new TestObject('VCALENDAR', { TEST: { required: true } })
    object.addProperty('ANOTHER', '__TEST_VALUE__')

    expect(() => object.validate()).toThrowError('TEST is a required property of VCALENDAR')
  })

  it('should throw an error when a required rules is func and property is missing', () => {
    const required = () => true
    const object = new TestObject('VCALENDAR', { TEST: { required } })
    object.addProperty('ANOTHER', '__TEST_VALUE__')

    expect(() => object.validate()).toThrowError('TEST is a required property of VCALENDAR')
  })

  it('should throw an error when a property occurs more than once', () => {
    const object = new TestObject('VCALENDAR', { TEST: { required: false, once: true } })
    object.addProperty('TEST', '__FIRST_TEST_VALUE__')
    object.addProperty('TEST', '_SECOND_TEST_VALUE_')

    expect(() => object.validate()).toThrowError('TEST property must not occur more than once of VCALENDAR')
  })

  it('should format all properties to a string', () => {
    const object = new TestObject('VCALENDAR', {})
    object.addProperty('FIRST', '__FIRST_VALUE__')
    object.addProperty('SECOND', '__SECOND_VALUE__')

    expect(object.format()).toEqual([
      'BEGIN:VCALENDAR',
      'FIRST:__FIRST_VALUE__',
      'SECOND:__SECOND_VALUE__',
      'END:VCALENDAR',
    ])
  })

  it('should format all occurrences of a property to a string with the same name', () => {
    const object = new TestObject('VCALENDAR', {})
    object.addProperty('FIRST', '__FIRST_VALUE__')
    object.addProperty('FIRST', '__SECOND_VALUE__')

    expect(object.format()).toEqual([
      'BEGIN:VCALENDAR',
      'FIRST:__FIRST_VALUE__',
      'FIRST:__SECOND_VALUE__',
      'END:VCALENDAR',
    ])
  })
})
