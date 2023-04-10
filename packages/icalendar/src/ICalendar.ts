import { CalendarObject } from './CalendarObject'
import { DEFAULT_PRODUCT_ID, formatProductIdentifier } from './ProductIdentifier'
import { VEvent } from './VEvent'
import { Properties } from './CalendarProperty'

interface CalendarProperties extends Properties {
  CALSCALE: string
  METHOD: string
  PRODID: string
  VERSION: string
}

export class ICalendar extends CalendarObject<CalendarProperties> {
  validProperties: (keyof CalendarProperties)[] = ['']

  constructor(productId = DEFAULT_PRODUCT_ID) {
    super('VCALENDAR')

    // Create base properties
    this.addProperty('VERSION', '2.0')
    this.addProperty('PRODID', formatProductIdentifier(productId))
    this.addComponent(new VEvent())
  }
}
