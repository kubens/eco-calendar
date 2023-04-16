import { CalendarProperty } from './CalendarProperty'

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace CalendarObject {
  export type Element = 'VCALENDAR' | 'VEVENT'

  export type Schema<PropertyName extends string> = {
    [P in PropertyName]: {
      required: boolean | ((names: PropertyName[]) => boolean)
      excludedBy?: PropertyName[] | (() => string[] | undefined)
      once?: boolean
    }
  }
}

export abstract class CalendarObject<
  Properties extends Record<string, CalendarProperty.Value> = Record<string, CalendarProperty.Value>,
  ChildObject extends CalendarObject = never,
  PropertyName extends keyof Properties & string = keyof Properties & string,
  PropertyValue extends CalendarProperty.Value = CalendarProperty.ExtractValue<Properties, PropertyName>
> {
  schema: CalendarObject.Schema<PropertyName>
  element: CalendarObject.Element
  children: Record<string, ChildObject[]>
  properties: Record<string, CalendarProperty<PropertyName, PropertyValue>[]>

  constructor(element: CalendarObject.Element, schema: CalendarObject.Schema<PropertyName>) {
    this.element = element
    this.schema = schema
    this.children = {}
    this.properties = {}
  }

  addChild(object: ChildObject): void {
    this.children[object.element] = this.children[object.element] || []
    this.children[object.element].push(object)
  }

  getChildren(element?: ChildObject['element']): ChildObject[] {
    if (!element) {
      let output: ChildObject[] = []

      for (const element in this.children) {
        output = output.concat(this.children[element])
      }

      return output
    }

    return this.children[element]
  }

  removeChildren(object?: CalendarObject.Element) {
    if (!object) {
      this.children = {}
    } else {
      delete this.children[object]
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
