import { CalendarObject } from './CalendarObject'
import { DEFAULT_PRODUCT_ID, formatProductIdentifier } from './ProductIdentifier'

type CalendarProperties = {
  CALSCALE: string
  METHOD: string
  PRODID: string
  VERSION: string
}

export class ICalendar extends CalendarObject<CalendarProperties> {
  constructor(productId = DEFAULT_PRODUCT_ID) {
    super('VCALENDAR', {
      CALSCALE: { required: false, once: true },
      METHOD: { required: false, once: true },
      PRODID: { required: true, once: true },
      VERSION: { required: true, once: false },
    })

    // Create base properties
    this.addProperty('VERSION', '2.0')
    this.addProperty('PRODID', formatProductIdentifier(productId))
  }
}
