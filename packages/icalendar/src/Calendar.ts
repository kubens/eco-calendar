import { CalendarObject } from './CalendarObject'
import { DEFAULT_PRODUCT_ID, formatProductIdentifier } from './ProductIdentifier'

export class Calendar extends CalendarObject {
  constructor(productId = DEFAULT_PRODUCT_ID) {
    super('VCALENDAR')

    // Create base properties
    this.addProperty('VERSION', '2.0')
    this.addProperty('PRODID', formatProductIdentifier(productId))
  }
}
