import { CalendarProperty, Parameters, Properties, PropertyValue } from './CalendarProperty'

export type CalendarElement = 'VCALENDAR' | 'VEVENT'

export abstract class CalendarObject<T extends Properties = Properties> {
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
  addProperty<Name extends keyof T & string>(name: Name, value: PropertyValue<T, Name>, parameters?: Parameters): void
  addProperty<Name extends keyof T & string>(
    nameOrInstance: Name | CalendarProperty,
    value?: PropertyValue,
    parameters?: Parameters
  ): void {
    let property: CalendarProperty

    if (nameOrInstance instanceof CalendarProperty) {
      property = nameOrInstance
    } else if (value) {
      property = new CalendarProperty(nameOrInstance, value, parameters)
    } else {
      return
    }

    this.properties[property.name] = this.properties[property.name] ?? []
    this.properties[property.name].push(property)
  }

  setProperty(property: CalendarProperty): void
  setProperty<Name extends keyof T & string>(name: Name, value: PropertyValue<T, Name>, parameters?: Parameters): void
  setProperty<Name extends keyof T & string>(
    nameOrInstance: Name | CalendarProperty,
    value?: PropertyValue<T, Name>,
    parameters?: Parameters
  ): void {
    if (nameOrInstance instanceof CalendarProperty) {
      this.removeProperty(nameOrInstance.name)
      this.addProperty(nameOrInstance)
    } else {
      this.removeProperty(nameOrInstance)
      this.addProperty(nameOrInstance, value as PropertyValue<T, Name>, parameters)
    }
  }

  removeProperty<Name extends keyof T & string>(name: Name): void {
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
