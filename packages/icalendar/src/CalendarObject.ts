import { CalendarProperty, Parameters, PropertyName, PropertyValue } from './CalendarProperty'

export type CalendarElement = 'VCALENDAR' | 'VEVENT'

export abstract class CalendarObject {
  element: CalendarElement
  components: Record<string, CalendarObject[]>
  properties: Record<string, CalendarProperty[]>

  constructor(element: CalendarElement) {
    this.element = element
    this.components = {}
    this.properties = {}
  }

  addComponent(component: CalendarObject): void {
    this.components[component.element] = this.components[component.element] || []
    this.components[component.element].push(component)
  }

  getComponents(element?: CalendarElement): CalendarObject[] {
    if (!element) {
      let output: CalendarObject[] = []

      for (const element in this.components) {
        output = output.concat(this.components[element])
      }

      return output
    }

    return this.components[element]
  }

  removeComponents(element?: CalendarElement) {
    if (!element) {
      this.components = {}
    } else {
      delete this.components[element]
    }
  }

  addProperty(property: CalendarProperty): void
  addProperty<Name extends PropertyName>(name: Name, value: PropertyValue<Name>, parameters?: Parameters): void
  addProperty(data: PropertyName | CalendarProperty, value?: PropertyValue, parameters?: Parameters): void {
    let property: CalendarProperty

    if (data instanceof CalendarProperty) {
      property = data
    } else if (value) {
      property = new CalendarProperty(data, value, parameters)
    } else {
      return
    }

    this.properties[property.name] = this.properties[property.name] ?? []
    this.properties[property.name].push(property)
  }

  removeProperty(name: PropertyName): void {
    delete this.properties[name]
  }

  format(): string[] {
    const lines: string[] = [`BEGIN:${this.element}`]

    for (const name in this.properties) {
      this.properties[name].forEach((prop) => {
        lines.push(...prop.format())
      })
    }

    lines.push(`END:${this.element}`)
    return lines
  }

  toString(): string {
    const output: string[] = this.format()
    // Add empty element to ensure trailing CRLF.
    output.push('')
    return output.join('\r\n')
  }
}
