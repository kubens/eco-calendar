import { DateTime } from './DateTime'
import { Duration } from './Duration'

const MAX_LINE = 75

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace CalendarProperty {
  export type Parameters = Record<string, string>
  export type Value = string | string[] | boolean | number | DateTime | Duration
  export type ExtractValue<T extends Record<string, Value>, I extends keyof T = keyof T> = T[I]
}

export class CalendarProperty<
  Name extends string = string,
  Value extends CalendarProperty.Value = CalendarProperty.Value
> {
  name: Name
  value: Value
  parameters: CalendarProperty.Parameters

  get formattedValue(): string {
    if (Array.isArray(this.value)) {
      return this.value.map(this.formatText).join(',')
    }

    return this.formatText(this.value.toString())
  }

  constructor(name: Name, value: Value, parameters?: CalendarProperty.Parameters) {
    this.name = name
    this.value = value
    this.parameters = parameters ?? {}
  }

  setParameter(name: string, value: string) {
    this.parameters[name] = value
  }

  removeParameter(name: string) {
    delete this.parameters[name]
  }

  format(): string[] {
    const params = []
    let key = this.name.toString()

    for (const name in this.parameters) {
      params.push(`${name}=${this.parameters[name]}`)
    }

    if (params.length) {
      key += `;${params.join(';')}`
    }

    return this.wrapText(`${key}:${this.formattedValue}`)
  }

  private wrapText(line: string): string[] {
    const output: string[] = []
    const words = line.split(' ')
    let currentLineLength = 0
    let currentLine = ''

    for (let i = 0; i < words.length; i++) {
      const word = words[i]

      if (currentLineLength + word.length + 1 > MAX_LINE) {
        output.push(currentLine.trim())
        currentLine = ''
        currentLineLength = 0
      }

      currentLine += ` ${word}`
      currentLineLength += word.length + 1
    }

    if (currentLine.trim().length > 0) {
      output.push(currentLine.trim())
    }

    for (let i = 1; i < output.length; i++) {
      output[i] = ` ${output[i]}`
    }

    return output
  }

  private formatText(text: string): string {
    // prettier-ignore
    return text
      .replace(/([\\,;])/g, "\\$1")
      .replace(/\n/g, "\\n");
  }
}
