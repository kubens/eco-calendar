import { CalendarObject } from './CalendarObject'
import { Duration } from './Duration'
import { DEFAULT_PRODUCT_ID, formatProductIdentifier } from './ProductIdentifier'
import { VEvent } from './VEvent'

type ICalendarProperties = {
  CALSCALE: string
  METHOD: 'PUBLISH' | 'REQUEST' | 'REPLY' | 'ADD' | 'CANCEL' | 'REFRESH' | 'COUNTER' | 'DECLINECOUNTER'
  PRODID: string
  VERSION: string
  'REFRESH-INTERVAL': Duration
  'X-PUBLISHED-TTL': Duration
  'X-WR-CALNAME': string
}

export class ICalendar extends CalendarObject<ICalendarProperties, VEvent> {
  constructor(productId = DEFAULT_PRODUCT_ID) {
    super('VCALENDAR', {
      CALSCALE: { required: false, once: true },
      METHOD: { required: false, once: true },
      PRODID: { required: true, once: true },
      VERSION: { required: true, once: true },
      'REFRESH-INTERVAL': { required: false, once: true },
      'X-PUBLISHED-TTL': { required: false, once: true },
      'X-WR-CALNAME': { required: false, once: true },
    })

    // Create base properties
    this.addProperty('VERSION', '2.0')
    this.addProperty('PRODID', formatProductIdentifier(productId))
  }

  setTTL(duration: Duration): void {
    this.setProperty('REFRESH-INTERVAL', duration, { VALUE: 'DURATION' })
    this.setProperty('X-PUBLISHED-TTL', duration)
  }
}
