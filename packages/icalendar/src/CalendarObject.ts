import { CalendarProperty, CalendarPropertyValue, Parameters, PropertyValue } from './CalendarProperty'

export type ObjectElement = 'VCALENDAR' | 'VEVENT'

export type ObjectSchema<Properties extends Record<string, CalendarPropertyValue>> = {
  [P in keyof Properties]: { required: boolean; once?: boolean }
}

export abstract class CalendarObject<
  Properties extends Record<string, CalendarPropertyValue> = Record<string, CalendarPropertyValue>,
  Component extends CalendarObject = never,
  Schema extends ObjectSchema<Properties> = ObjectSchema<Properties>
> {
  schema: Schema
  element: ObjectElement
  components: Record<string, Component[]>
  properties: Record<string, CalendarProperty<Properties>[]>

  constructor(element: ObjectElement, schema: Schema) {
    this.element = element
    this.schema = schema
    this.components = {}
    this.properties = {}
  }

  addComponent(component: Component): void {
    this.components[component.element] = this.components[component.element] || []
    this.components[component.element].push(component)
  }

  getComponents(element?: Component['element']): Component[] {
    if (!element) {
      let output: Component[] = []

      for (const element in this.components) {
        output = output.concat(this.components[element])
      }

      return output
    }

    return this.components[element]
  }

  removeComponents(element?: ObjectElement) {
    if (!element) {
      this.components = {}
    } else {
      delete this.components[element]
    }
  }

  addProperty<Name extends keyof Properties & string>(
    name: Name,
    value: PropertyValue<Properties, Name>,
    parameters?: Parameters
  ): void {
    const property = new CalendarProperty(name, value, parameters)

    this.properties[property.name] = this.properties[property.name] ?? []
    this.properties[property.name].push(property)
  }

  setProperty<Name extends keyof Properties & string>(
    name: Name,
    value: PropertyValue<Properties, Name>,
    parameters?: Parameters
  ): void {
    this.removeProperty(name)
    this.addProperty(name, value, parameters)
  }

  getProperties<Name extends keyof Properties & string>(name: Name): CalendarProperty<Properties>[] | undefined {
    return this.properties[name] ?? undefined
  }

  removeProperty<Name extends keyof Properties & string>(name: Name): void {
    delete this.properties[name]
  }

  validate(): void {
    for (const name in this.schema) {
      const { required, once } = this.schema[name]
      const properties = this.getProperties(name)

      // Check property exists.
      if (required && (!properties || properties.length === 0)) {
        throw new Error(`${name} is a required property of ${this.element}`)
      }

      if (once && properties && properties.length > 1) {
        throw new Error(`${name} must not occur more than once property of ${this.element}`)
      }
    }
  }

  format(): string[] {
    this.validate()
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
