import { beforeEach, describe, expect, it } from 'vitest'
import { VAlarm } from '../src/VAlarm'
import { Duration } from '../src/Duration'

describe('VAlarm Object', () => {
  it('should require ACTION', () => {
    const given = new VAlarm()

    expect(() => given.validate()).toThrowError('ACTION is a required property of VALARM')
  })

  it('should require ACTION to occur once', () => {
    const given = new VAlarm()
    given.addProperty('ACTION', '__ANY__')
    given.addProperty('ACTION', '__ANY__')

    expect(() => given.validate()).toThrowError('ACTION property must not occur more than once of VALARM')
  })

  it('should require TRIGGER property', () => {
    const given = new VAlarm()
    given.setProperty('ACTION', '__ANY__')

    expect(() => given.validate()).toThrowError('TRIGGER is a required property of VALARM')
  })

  it('should require TRIGGER to occur once', () => {
    const trigger = new Duration({ isNegative: true, days: 1 })
    const given = new VAlarm()

    given.setProperty('ACTION', '__ANY__')
    given.addProperty('TRIGGER', trigger)
    given.addProperty('TRIGGER', trigger)

    expect(() => given.validate()).toThrowError('TRIGGER property must not occur more than once of VALARM')
  })

  it('should require a REPEAT when DURATION occur', () => {
    const duration = new Duration({ minutes: 5 })
    const given = new VAlarm()

    given.setProperty('ACTION', '__ANY__')
    given.setProperty('DURATION', duration)

    expect(() => given.validate()).toThrowError('REPEAT is a required property of VALARM')
  })

  it('should require REPEAT to occur once', () => {
    const duration = new Duration({ minutes: 5 })
    const given = new VAlarm()

    given.setProperty('ACTION', '__ANY__')
    given.setProperty('DURATION', duration)
    given.addProperty('REPEAT', 1)
    given.addProperty('REPEAT', 1)

    expect(() => given.validate()).toThrowError('REPEAT property must not occur more than once of VALARM')
  })

  it('should require DURATION when REPEAT occur', () => {
    const given = new VAlarm()

    given.setProperty('ACTION', '__ANY__')
    given.setProperty('REPEAT', 1)

    expect(() => given.validate()).toThrowError('DURATION is a required property of VALARM')
  })

  it('should require DURATION to occur once', () => {
    const duration = new Duration({ minutes: 5 })
    const given = new VAlarm()

    given.setProperty('ACTION', '__ANY__')
    given.setProperty('REPEAT', 1)
    given.addProperty('DURATION', duration)
    given.addProperty('DURATION', duration)

    expect(() => given.validate()).toThrowError('DURATION property must not occur more than once of VALARM')
  })

  describe('when ACTION property has DISPLAY value ', () => {
    let alarm: VAlarm

    beforeEach(() => {
      const trigger = new Duration({ isNegative: true, days: 1 })
      alarm = new VAlarm()

      alarm.setProperty('ACTION', 'DISPLAY')
      alarm.setProperty('TRIGGER', trigger)
    })

    it('should require ATTACH do not occur', () => {
      alarm.setProperty('ATTACH', '__ATTACH__')

      expect(() => alarm.validate()).toThrowError('ATTACH property should not occur of VALARM')
    })

    it('should require DESCRIPTION property', () => {
      expect(() => alarm.validate()).toThrowError('DESCRIPTION is a required property of VALARM')
    })

    it('should require DESCRIPTION to occur once', () => {
      alarm.addProperty('DESCRIPTION', '__DESCRIPTION__')
      alarm.addProperty('DESCRIPTION', '__DESCRIPTION__')

      expect(() => alarm.validate()).toThrowError('DESCRIPTION property must not occur more than once of VALARM')
    })
  })

  describe('when ACTION property has AUDIO value', () => {
    let alarm: VAlarm

    beforeEach(() => {
      const trigger = new Duration({ isNegative: true, days: 1 })
      alarm = new VAlarm()

      alarm.setProperty('ACTION', 'AUDIO')
      alarm.setProperty('TRIGGER', trigger)
    })

    it('should require ATTACH to occur once', () => {
      alarm.addProperty('ATTACH', '__ATTACH__')
      alarm.addProperty('ATTACH', '__ATTACH__')

      expect(() => alarm.validate()).toThrowError('ATTACH property must not occur more than once of VALARM')
    })

    it('should require DESCRIPTION do not occur', () => {
      alarm.setProperty('DESCRIPTION', '__DESCRIPTION__')

      expect(() => alarm.validate()).toThrowError('DESCRIPTION property should not occur of VALARM')
    })
  })
})
