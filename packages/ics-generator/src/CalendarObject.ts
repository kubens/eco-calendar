import { CalendarProperty, ExtractPropertyValue, PropertyParameters, PropertyValue } from './CalendarProperty'

export type CalendarElement = 'VCALENDAR' | 'VEVENT'

export type ObjectSchema<
  Properties extends Record<string, PropertyValue>,
  Name extends keyof Properties & string = keyof Properties & string
> = {
  [P in Name]: {
    required: boolean | ((names: Name[]) => boolean)
    excludedBy?: Name[] | (() => string[] | undefined)
    once?: boolean
  }
}

export abstract class CalendarObject<
  Properties extends Record<string, PropertyValue>,
  Child extends CalendarObject<Record<any, PropertyValue>> = never,
  PropertyName extends keyof Properties & string = keyof Properties & string,
  Value extends PropertyValue = ExtractPropertyValue<Properties, PropertyName>,
  Schema extends ObjectSchema<Properties> = ObjectSchema<Properties>
> {
  schema: Schema
  element: CalendarElement
  children: Record<string, Child[]>
  properties: Record<string, CalendarProperty<PropertyName, Value>[]>

  constructor(element: CalendarElement, schema: Schema) {
    this.element = element
    this.schema = schema
    this.children = {}
    this.properties = {}
  }

  addChild(object: Child): void {
    this.children[object.element] = this.children[object.element] || []
    this.children[object.element].push(object)
  }

  addChildren(objects: Child[]): void {
    objects.forEach(this.addChild)
  }

  getChildren(element?: Child['element']): Child[] {
    if (!element) {
      let output: Child[] = []

      for (const element in this.children) {
        output = output.concat(this.children[element])
      }

      return output
    }

    return this.children[element]
  }

  removeChildren(element?: CalendarElement) {
    if (!element) {
      this.children = {}
    } else {
      delete this.children[element]
    }
  }

  addProperty(name: PropertyName, value: Value, parameters?: PropertyParameters): void {
    const property = new CalendarProperty(name, value, parameters)

    this.properties[property.name] = this.properties[property.name] ?? []
    this.properties[property.name].push(property)
  }

  setProperty(name: PropertyName, value: Value, parameters?: PropertyParameters): void {
    this.removeProperty(name)
    this.addProperty(name, value, parameters)
  }

  hasProperty(name: PropertyName): boolean {
    return name in this.properties
  }

  getProperties(name: PropertyName): CalendarProperty<PropertyName, Value>[] | undefined {
    if (name in this.properties) {
      return this.properties[name]
    }
  }

  removeProperty(name: PropertyName): void {
    delete this.properties[name]
  }

  /** @throws Will throw an `Error` when `CalendarObject` is invalid. */
  validate(): void {
    for (const name in this.schema) {
      const rules = this.schema[name]

      // Check is current property is not excluded by another property.
      if (rules.excludedBy) {
        const excludedBy =
          typeof rules.excludedBy === 'function'
            ? rules.excludedBy()
            : rules.excludedBy.find((excludingName) => excludingName in this.properties)

        if (excludedBy) throw new Error(`${name} property should not occur with ${excludedBy}`)
      }

      // Check is property should occur once.
      if (rules.once && this.properties[name]?.length > 1) {
        throw new Error(`${name} property must not occur more than once of ${this.element}`)
      }

      // Check is current property is required and not exists in properties.
      const isRequired =
        typeof rules.required === 'function'
          ? rules.required(Object.keys(this.properties) as PropertyName[])
          : rules.required

      if (isRequired && !(name in this.properties)) {
        throw new Error(`${name} is a required property of ${this.element}`)
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

    for (const child in this.children) {
      this.children[child].forEach((object) => {
        lines.push(...object.format())
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
