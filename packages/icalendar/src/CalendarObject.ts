import { CalendarProperty } from './CalendarProperty'

export type ObjectElement = 'VCALENDAR' | 'VEVENT'

export type ObjectSchema<Properties extends Record<string, CalendarProperty.Value>> = {
  [P in keyof Properties & string]: { required: boolean; once?: boolean }
}

export abstract class CalendarObject<
  Properties extends Record<string, CalendarProperty.Value> = Record<string, CalendarProperty.Value>,
  Component extends CalendarObject = never,
  PropertyName extends keyof Properties & string = keyof Properties & string,
  PropertyValue extends CalendarProperty.Value = CalendarProperty.ExtractValue<Properties, PropertyName>
> {
  schema: ObjectSchema<Properties>
  element: ObjectElement
  components: Record<string, Component[]>
  properties: Record<string, CalendarProperty<PropertyName, PropertyValue>[]>

  constructor(element: ObjectElement, schema: ObjectSchema<Properties>) {
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

  addProperty(name: PropertyName, value: PropertyValue, parameters?: CalendarProperty.Parameters): void {
    const property = new CalendarProperty(name, value, parameters)

    this.properties[property.name] = this.properties[property.name] ?? []
    this.properties[property.name].push(property)
  }

  setProperty(name: PropertyName, value: PropertyValue, parameters?: CalendarProperty.Parameters): void {
    this.removeProperty(name)
    this.addProperty(name, value, parameters)
  }

  getProperties(name: PropertyName): CalendarProperty<PropertyName, PropertyValue>[] | undefined {
    if (name in this.properties) {
      return this.properties[name]
    }
  }

  removeProperty(name: PropertyName): void {
    delete this.properties[name]
  }

  validate(): void {
    for (const name in this.schema) {
      const { required, once } = this.schema[name]
      const properties = this.getProperties(name as unknown as PropertyName)

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
