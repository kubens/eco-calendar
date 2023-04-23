import { CalendarObject } from './CalendarObject'
import { DateTime } from './DateTime'
import { ICalendar } from './ICalendar'
import { VAlarm } from './VAlarm'

type EventProperties = {
  UID: string
  DTSTAMP: DateTime
  DTSTART: DateTime
  SUMMARY: string
  TRANSP: 'OPAQUE' | 'TRANSPARENT'
}

export class VEvent extends CalendarObject<EventProperties, VAlarm> {
  readonly calendar?: ICalendar

  constructor(calendar?: ICalendar) {
    super('VEVENT', {
      UID: { required: true, once: true },
      DTSTAMP: { required: true, once: true },
      DTSTART: { required: () => !this.calendar?.hasProperty('METHOD'), once: true },
      SUMMARY: { required: false, once: true },
      TRANSP: { required: false, once: true },
    })

    this.calendar = calendar
    this.addProperty('UID', crypto.randomUUID())
    this.addProperty('DTSTAMP', DateTime.fromDate(new Date()))
  }

  alarm(): VAlarm {
    const alarm = new VAlarm()
    this.addChild(alarm)

    return alarm
  }
}
